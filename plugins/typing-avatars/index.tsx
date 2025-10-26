import { Design } from '@revenge-mod/discord/design'
import { Stores } from '@revenge-mod/discord/flux'
import { getModules, lookupModule } from '@revenge-mod/modules/finders'
import { withName, withProps } from '@revenge-mod/modules/finders/filters'
import { after } from '@revenge-mod/patcher'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import { findInReactFiber } from '@revenge-mod/utils/react'
import { Image, StyleSheet, View } from 'react-native'
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
            const [AvatarUtils] = lookupModule(
                withProps<AvatarUtils>('getUserAvatarURL'),
            )
            if (!AvatarUtils) throw new Error('AvatarUtils not found')

            cleanup(
                getModules(
                    withName<FC>('TypingIndicator'),
                    TypingIndicatorModule => {
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
        marginRight: 4,
    },
    container: {
        flexDirection: 'row',
    },
})

function patchTypingIndicator(
    TypingIndicatorModule: { default: FC },
    AvatarUtils: AvatarUtils,
) {
    const UserStore = Stores.UserStore as DiscordModules.Flux.Store<{
        getUser(userId: string, _: boolean, size: number): unknown
    }>

    return after(TypingIndicatorModule, 'default', result => {
        const tree = result as ReactElement<TypingIndicatorTreeProps>

        after(tree.props, 'renderItem', result => {
            const renderItemTree = result as ReactElement<
                RenderTypingIndicatorProps,
                FC<RenderTypingIndicatorProps>
            >

            if (renderItemTree.props.typingUserIds.length) {
                after(renderItemTree, 'type', result =>
                    patchTypingView(
                        result as ReactElement,
                        renderItemTree.props.typingUserIds,
                        UserStore,
                        AvatarUtils,
                    ),
                )
            }

            return renderItemTree
        })

        return tree
    })
}

function patchTypingView(
    tree: ReactElement,
    typingUserIds: string[],
    UserStore: DiscordModules.Flux.Store<{
        getUser(userId: string, _: boolean, size: number): unknown
    }>,
    AvatarUtils: AvatarUtils,
) {
    /**
     * <View> (Parent is Stack?)
     *   <Ellipsis />
     *   <Text>
     *     <Text>User</Text>
     *     {' '}and
     *     <Text>Other user</Text>
     *     {' '}are typing...
     *   </Text>
     * </View>
     */
    const viewNode = findInReactFiber(
        tree,
        (
            node,
        ): node is ReactElement<ComponentProps<typeof View>> & {
            props: { children: ReactNode[] }
        } =>
            node.type === View &&
            node.props?.children?.find(
                (subnode: ReactNode) =>
                    (subnode as ReactElement)?.type === Design.Text,
            ),
    )

    if (!viewNode) return tree

    const textNode = viewNode.props.children![1] as ReactElement<
        ComponentProps<DiscordModules.Components.Text>
    > & { props: { children: ReactNode[] } }

    function StyledText({ children }: { children: ReactNode }) {
        return (
            <Design.Text {...textNode.props} style={undefined}>
                {children}
            </Design.Text>
        )
    }

    let userIndex = 0

    viewNode.props.children[1] = (
        <View style={styles.container}>
            {textNode.props.children.map(node => {
                if (typeof node !== 'object') {
                    return <StyledText>{node}</StyledText>
                }

                const uid = typingUserIds[userIndex]
                if (!uid) return <StyledText>{node}</StyledText>

                const user = UserStore.getUser(uid, false, 16)
                const uri = AvatarUtils.getUserAvatarURL(user)

                userIndex++

                return (
                    <View style={styles.container} key={uid}>
                        <Image source={{ uri }} style={styles.avatar} />
                        <StyledText>{node}</StyledText>
                    </View>
                )
            })}
        </View>
    )

    return tree
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
