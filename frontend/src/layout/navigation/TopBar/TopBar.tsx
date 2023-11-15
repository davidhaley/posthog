import './TopBar.scss'

import { useActions, useValues } from 'kea'
import { ActivationSidebarToggle } from 'lib/components/ActivationSidebar/ActivationSidebarToggle'
import { CommandPalette } from 'lib/components/CommandPalette/CommandPalette'
import { HelpButton } from 'lib/components/HelpButton/HelpButton'
import { TaxonomicFilterGroupType } from 'lib/components/TaxonomicFilter/types'
import { UniversalSearchPopover } from 'lib/components/UniversalSearch/UniversalSearchPopover'
import { FEATURE_FLAGS } from 'lib/constants'
import { IconMenu, IconMenuOpen } from 'lib/lemon-ui/icons'
import { Link } from 'lib/lemon-ui/Link'
import { featureFlagLogic } from 'lib/logic/featureFlagLogic'

import { NotebookButton } from '~/layout/navigation/TopBar/NotebookButton'
import { NotificationBell } from '~/layout/navigation/TopBar/NotificationBell'
import { groupsModel } from '~/models/groupsModel'
import { Logo } from '~/toolbar/assets/Logo'

import { navigationLogic } from '../navigationLogic'
import { Announcement } from './Announcement'
import { SitePopover } from './SitePopover'

export function TopBar(): JSX.Element {
    const { isSideBarShown, noSidebar, minimalTopBar, mobileLayout } = useValues(navigationLogic)
    const { toggleSideBarBase, toggleSideBarMobile } = useActions(navigationLogic)
    const { groupNamesTaxonomicTypes } = useValues(groupsModel)
    const { featureFlags } = useValues(featureFlagLogic)

    const hasNotebooks = !!featureFlags[FEATURE_FLAGS.NOTEBOOKS]

    const groupTypes = [
        TaxonomicFilterGroupType.Events,
        TaxonomicFilterGroupType.Persons,
        TaxonomicFilterGroupType.Actions,
        TaxonomicFilterGroupType.Cohorts,
        TaxonomicFilterGroupType.Insights,
        TaxonomicFilterGroupType.FeatureFlags,
        TaxonomicFilterGroupType.Plugins,
        TaxonomicFilterGroupType.Experiments,
        TaxonomicFilterGroupType.Dashboards,
        ...groupNamesTaxonomicTypes,
    ]

    if (hasNotebooks) {
        groupTypes.push(TaxonomicFilterGroupType.Notebooks)
    }

    return (
        <>
            <Announcement />
            <header className="TopBar">
                <div className="TopBar__segment TopBar__segment--left">
                    {!noSidebar && (
                        <div
                            className="TopBar__hamburger"
                            onClick={() => (mobileLayout ? toggleSideBarMobile() : toggleSideBarBase())}
                        >
                            {isSideBarShown ? <IconMenuOpen /> : <IconMenu />}
                        </div>
                    )}
                    <Link to="/" className="TopBar__logo">
                        <Logo />
                    </Link>
                    {!minimalTopBar && (
                        <>
                            <div className="grow">
                                <UniversalSearchPopover
                                    groupType={TaxonomicFilterGroupType.Events}
                                    groupTypes={groupTypes}
                                />
                            </div>
                            <ActivationSidebarToggle />
                        </>
                    )}
                </div>
                <div className="TopBar__segment TopBar__segment--right">
                    {!minimalTopBar && (
                        <>
                            {hasNotebooks && <NotebookButton />}
                            <NotificationBell />
                        </>
                    )}
                    <HelpButton />
                    <SitePopover />
                </div>
            </header>
            <CommandPalette />
        </>
    )
}
