import { AlertActionCreators } from '@revenge-mod/discord/actions'
import { Design } from '@revenge-mod/discord/design'

const { AlertActionButton, AlertModal } = Design

function UnsupportedStickerAlert() {
    return (
        <AlertModal
            title="Unsupported Sticker"
            content="This sticker format is not supported by Fake Nitro."
            actions={<AlertActionButton variant="primary" text="Got it" />}
        />
    )
}

export function promptUnsupportedStickerAlert() {
    AlertActionCreators.openAlert(
        'palmdevs.fake-nitro.unsupported-sticker',
        <UnsupportedStickerAlert />,
    )
}
