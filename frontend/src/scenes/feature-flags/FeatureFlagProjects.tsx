import { OrganizationFeatureFlag } from '~/types'
import { createdAtColumn, createdByColumn } from 'lib/lemon-ui/LemonTable/columnUtils'
import { LemonTable, LemonTableColumn, LemonTableColumns } from 'lib/lemon-ui/LemonTable'
import { LemonButton, LemonSelect, LemonTag, Link, LemonBanner } from '@posthog/lemon-ui'
import { IconArrowRight, IconSync } from 'lib/lemon-ui/icons'
import { groupFilters } from './FeatureFlags'
import { useActions, useValues } from 'kea'
import { featureFlagLogic } from './featureFlagLogic'
import { organizationLogic } from '../organizationLogic'
import { teamLogic } from 'scenes/teamLogic'
import { userLogic } from 'scenes/userLogic'
import { useEffect } from 'react'
import { groupsModel } from '~/models/groupsModel'

const getColumns = (): LemonTableColumns<OrganizationFeatureFlag> => {
    const { currentTeamId } = useValues(teamLogic)
    const { currentOrganization } = useValues(organizationLogic)
    const { updateCurrentTeam } = useActions(userLogic)
    const { aggregationLabel } = useValues(groupsModel)

    return [
        {
            title: 'Project',
            dataIndex: 'team_id',
            width: '45%',
            render: (dataValue, record) => {
                const team = currentOrganization?.teams?.find((t) => t.id === Number(dataValue))
                if (!team) {
                    return '(project does not exist)'
                }
                const isCurrentTeam = team.id === currentTeamId
                const linkText = isCurrentTeam ? `${team.name} (current)` : team.name

                return isCurrentTeam ? (
                    <span className="font-semibold">{linkText}</span>
                ) : (
                    <Link
                        className="row-name"
                        onClick={() => {
                            updateCurrentTeam(team.id, `/feature_flags/${record.flag_id}`)
                        }}
                    >
                        {linkText}
                    </Link>
                )
            },
        },
        createdByColumn() as LemonTableColumn<OrganizationFeatureFlag, keyof OrganizationFeatureFlag | undefined>,
        createdAtColumn() as LemonTableColumn<OrganizationFeatureFlag, keyof OrganizationFeatureFlag | undefined>,
        {
            title: 'Release conditions',
            width: 200,
            render: function Render(_, record: OrganizationFeatureFlag) {
                const releaseText = groupFilters(record.filters, undefined, aggregationLabel)
                return typeof releaseText === 'string' && releaseText.startsWith('100% of') ? (
                    <LemonTag type="highlight">{releaseText}</LemonTag>
                ) : (
                    releaseText
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'active',
            render: (dataValue) => {
                return dataValue ? (
                    <LemonTag type="success" className="uppercase">
                        Enabled
                    </LemonTag>
                ) : (
                    <LemonTag type="default" className="uppercase">
                        Disabled
                    </LemonTag>
                )
            },
        },
    ]
}

export default function FeatureFlagProjects(): JSX.Element {
    const { featureFlag, copyDestinationProject, projectsWithCurrentFlag, featureFlagCopyLoading } =
        useValues(featureFlagLogic)
    const { setCopyDestinationProject, loadProjectsWithCurrentFlag, copyFlag } = useActions(featureFlagLogic)
    const { currentOrganization } = useValues(organizationLogic)
    const { currentTeam } = useValues(teamLogic)

    useEffect(() => {
        loadProjectsWithCurrentFlag()
    }, [])

    return (
        <div>
            {featureFlag.can_edit ? (
                <>
                    <h3 className="l3">Feature flag copy</h3>
                    <div className="ant-row">Copy your flag and its configuration to another project.</div>
                    <div className="inline-flex gap-4 my-6">
                        <div>
                            <div className="font-semibold leading-6 h-6">Key</div>
                            <div className="border px-3 rounded h-10 text-center flex items-center justify-center max-w-200">
                                <span className="font-semibold truncate">{featureFlag.key}</span>
                            </div>
                        </div>
                        <div>
                            <div className="h-6" />
                            <IconArrowRight className="h-10" fontSize="30" />
                        </div>
                        <div>
                            <div className="font-semibold leading-6 h-6">Destination project</div>
                            <LemonSelect
                                dropdownMatchSelectWidth={false}
                                value={copyDestinationProject}
                                onChange={(id) => setCopyDestinationProject(id)}
                                options={
                                    currentOrganization?.teams
                                        ?.map((team) => ({ value: team.id, label: team.name }))
                                        .filter((option) => option.value !== currentTeam?.id) || []
                                }
                                className="min-w-40"
                            />
                        </div>
                        <div>
                            <div className="h-6" />
                            <LemonButton
                                disabledReason={!copyDestinationProject && 'Select destination project'}
                                loading={featureFlagCopyLoading}
                                type="primary"
                                icon={<IconSync />}
                                onClick={() => copyFlag()}
                                className="w-28 max-w-28"
                            >
                                {projectsWithCurrentFlag.find((p) => Number(p.team_id) === copyDestinationProject)
                                    ? 'Update'
                                    : 'Copy'}
                            </LemonButton>
                        </div>
                    </div>
                </>
            ) : (
                <LemonBanner type="info" className="mb-6">
                    You currently cannot copy this flag to another project. Contact your administrator to request
                    editing rights.
                </LemonBanner>
            )}
            <LemonTable
                loading={false}
                dataSource={projectsWithCurrentFlag}
                columns={getColumns()}
                emptyState="This feature flag is not being used in any other project."
            />
        </div>
    )
}
