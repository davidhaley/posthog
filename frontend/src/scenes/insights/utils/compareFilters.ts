import { AnyFilterType } from '~/types'
import { objectCleanWithEmpty, objectsEqual } from 'lib/utils'

import { cleanFilters } from './cleanFilters'

/** clean filters so that we can check for semantic equality with a deep equality check */
const clean = (f: Partial<AnyFilterType>): Partial<AnyFilterType> => {
    // remove undefined values, empty array and empty objects
    const cleanedFilters = objectCleanWithEmpty(cleanFilters(f))

    // TODO: Ignore filter_test_accounts for now, but should compare against default
    delete cleanedFilters.filter_test_accounts

    // remove properties related to persons modal
    delete cleanedFilters.entity_id
    delete cleanedFilters.entity_type
    delete cleanedFilters.entity_math

    // sync with DEFAULT_DATE_FROM_DAYS
    if (!cleanedFilters.date_from) {
        cleanedFilters.date_from = '-7d'
    }

    cleanedFilters.events = cleanedFilters.events?.map((e) => {
        if (!e.order && (cleanedFilters.events || []).length === 1 && (cleanedFilters.actions || []).length === 0) {
            e.order = 0
        }

        // event math `total` is the default
        if (e.math === 'total') {
            delete e.math
        }
        return e
    })
    return cleanedFilters
}

/** compares to filter objects for semantical equality */
export function compareFilters(a: Partial<AnyFilterType>, b: Partial<AnyFilterType>): boolean {
    // this is not optimized for speed and does not work for many cases yet
    // e.g. falsy values are not treated the same as undefined values, unset filters are not handled, ordering of series isn't checked
    return objectsEqual(clean(a), clean(b))
}
