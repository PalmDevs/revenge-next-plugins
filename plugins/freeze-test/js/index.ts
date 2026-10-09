import { lookupModules } from '@revenge-mod/modules/finders'
import { withDependencies } from '@revenge-mod/modules/finders/filters'

const { atLeast } = withDependencies

export default plugin({
	preInit() {
		for (const _ of lookupModules(withDependencies(atLeast(64))));
	},
})
