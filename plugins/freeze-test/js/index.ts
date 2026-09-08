import { ImportTrackerModuleId } from '@revenge-mod/discord/common/import-tracker'
import { lookupModule } from '@revenge-mod/modules/finders'
import {
	withDependencies,
	withProps,
} from '@revenge-mod/modules/finders/filters'
import { ReactNativeModuleId } from '@revenge-mod/react'

const { atLeast } = withDependencies

export default plugin({
	preInit() {
		lookupModule(
			withProps('TableRow', 'Button').and(
				withDependencies(
					atLeast(64, [
						[ImportTrackerModuleId],
						[ImportTrackerModuleId],
						[ReactNativeModuleId, ImportTrackerModuleId],
						[ImportTrackerModuleId],
						ImportTrackerModuleId,
					]),
				),
			),
		)
	},
})
