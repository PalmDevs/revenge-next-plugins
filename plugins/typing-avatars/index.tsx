import { Stores } from '@revenge-mod/discord/flux'
import { getModules, lookupModule } from '@revenge-mod/modules/finders'
import { withName, withProps } from '@revenge-mod/modules/finders/filters'
import { after } from '@revenge-mod/patcher'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import { findInReactFiber } from '@revenge-mod/utils/react'
import { Image, StyleSheet } from 'react-native'
import type { DiscordModules } from '@revenge-mod/discord/types'
import type { ComponentProps, FC, ReactElement, ReactNode } from 'react'

registerPlugin(
    {
        id: 'palmdevs.typing-avatars',
        name: 'Typing Avatars',
        description: 'See avatars of users typing.',
        author: 'Palm',
        icon: 'SuperReactionIcon',
    },
    {
        start({ cleanup }) {
            cleanup(
                getModules(
                    withName<FC>('TypingIndicator'),
                    TypingIndicatorModule => {
                        const [AvatarUtils] = lookupModule(
                            withProps<AvatarUtils>('getUserAvatarURL'),
                        )
                        if (!AvatarUtils)
                            throw new Error('AvatarUtils not found')

                        cleanup(
                            patchTypingIndicator(
                                TypingIndicatorModule as { default: FC },
                                AvatarUtils,
                            ),
                        )
                    },
                    { returnNamespace: true },
                ),
            )
        },
    },
    PluginFlags.Enabled,
    0,
)

const styles = StyleSheet.create({
    avatar: {
        width: 16,
        height: 16,
        alignSelf: 'center',
        borderRadius: 8,
    },
})

function patchTypingIndicator(
    TypingIndicatorModule: { default: FC },
    AvatarUtils: AvatarUtils,
) {
    return after(TypingIndicatorModule, 'default', result => {
        const tree = result as ReactElement<TypingIndicatorTreeProps>

        after(tree.props, 'renderItem', result => {
            const renderItemTree = result as ReactElement<
                RenderTypingIndicatorProps,
                FC<RenderTypingIndicatorProps>
            >

            after(renderItemTree, 'type', result => {
                const textNode = findInReactFiber(
                    result as ReactElement,
                    (
                        tree,
                    ): tree is ReactElement<
                        ComponentProps<DiscordModules.Components.Text>
                    > => tree.props?.variant !== undefined,
                )

                if (!textNode) return result

                injectAvatars(
                    textNode,
                    renderItemTree.props.typingUserIds,
                    AvatarUtils,
                )

                return result
            })

            return renderItemTree
        })

        return tree
    })
}

function injectAvatars(
    textNode: ReactElement<ComponentProps<DiscordModules.Components.Text>>,
    typingUserIds: string[],
    AvatarUtils: AvatarUtils,
) {
    const UserStore = Stores.UserStore as DiscordModules.Flux.Store<{
        getUser(userId: string, _: boolean, size: number): unknown
    }>

    let userIndex = 0

    for (const node_ of textNode.props.children as ReactNode[]) {
        if (!node_ || typeof node_ !== 'object') continue

        const userId = typingUserIds[userIndex]
        if (!userId) break

        const node = node_ as ReactElement<{ children: ReactNode[] }>

        const user = UserStore.getUser(userId, false, 16)
        const uri = AvatarUtils.getUserAvatarURL(user)

        // Add some spacing (because margin didn't work)
        node.props.children[0] = ` ${node.props.children[0]}`

        node.props.children.unshift(
            <Image source={{ uri }} style={styles.avatar} />,
        )

        userIndex++
    }
}

interface RenderTypingIndicatorProps {
    channel: unknown
    typingUserIds: string[]
    transitionState: number
    cleanUp: () => void
}

interface TypingIndicatorTreeProps {
    item:
        | {
              channel: unknown
              typingUserIds: string[]
          }
        | undefined
    renderItem(
        key: string,
        props: RenderTypingIndicatorProps,
        // state?
        _: number,
        // cleanup?
        __: () => void,
    ): unknown
}

interface AvatarUtils {
    getUserAvatarURL(user: unknown): string
}
