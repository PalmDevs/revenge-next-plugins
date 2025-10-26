import { AlertActionCreators } from '@revenge-mod/discord/actions'
import { Design } from '@revenge-mod/discord/design'
import { useEffect } from 'react'

const { AlertActionButton, AlertModal } = Design

function NoPermissionsAlert({ onClose }: { onClose: (val: boolean) => void }) {
    useEffect(() => () => onClose(false), [onClose])

    return (
        <AlertModal
            title="Continue without Fake Nitro?"
            content={`You are trying to send or edit a message that has a fake emoji or sticker, but you do not have permissions to embed links.\nThey will appear as-is. Are you sure you want to continue?`}
            actions={
                <>
                    <AlertActionButton
                        variant="destructive"
                        text="Send anyway"
                        onPress={() => {
                            onClose(true)
                        }}
                    />
                    <AlertActionButton
                        variant="secondary"
                        text="Cancel"
                        onPress={() => {
                            onClose(false)
                        }}
                    />
                </>
            }
        />
    )
}

export function promptNoPermissionsContinueAnyway() {
    return new Promise<boolean>(res =>
        AlertActionCreators.openAlert(
            'palmdevs.fake-nitro.no-permissions',
            <NoPermissionsAlert onClose={res} />,
        ),
    )
}
