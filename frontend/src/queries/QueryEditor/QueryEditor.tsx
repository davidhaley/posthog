import { useActions, useValues } from 'kea'
import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import schema from '~/queries/schema.json'
import { LemonButton } from 'lib/lemon-ui/LemonButton'
import { queryEditorLogic } from '~/queries/QueryEditor/queryEditorLogic'
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer'
import clsx from 'clsx'
import { Spinner } from 'lib/lemon-ui/Spinner'
import { QueryContext } from '~/queries/schema'
import { OpenEditorButton } from '~/queries/nodes/Node/OpenEditorButton'
import { Link } from 'lib/lemon-ui/Link'
import { LemonSelect } from 'lib/lemon-ui/LemonSelect'
import { stringifiedQueryExamples } from '~/queries/examples'

export interface QueryEditorProps {
    query: string
    setQuery?: (query: string) => void
    className?: string
    context?: QueryContext
}

let i = 0

export function QueryEditor(props: QueryEditorProps): JSX.Element {
    const [key] = useState(() => i++)
    const { queryInput, error, inputChanged } = useValues(queryEditorLogic({ ...props, key }))
    const { setQueryInput, saveQuery } = useActions(queryEditorLogic({ ...props, key }))
    const monaco = useMonaco()

    useEffect(() => {
        if (!monaco) {
            return
        }
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [
                {
                    uri: 'http://internal/node-schema.json',
                    fileMatch: ['*'], // associate with our model
                    schema: schema,
                },
            ],
        })
    }, [monaco])

    return (
        <>
            {props.context?.showQueryHelp ? (
                <div className="mb-2 flex flex-row flex-wrap justify-between items-center">
                    <div>
                        Buttons like
                        <div className="inline-block align-middle">
                            <OpenEditorButton query={null} type="secondary" size="small" className="ml-1 mr-1" />
                        </div>
                        open components powered by our JSON query language as a new insight. Read the{' '}
                        <Link
                            to="https://github.com/posthog/posthog/blob/master/frontend/src/queries/schema.ts"
                            target="_blank"
                        >
                            schema.ts
                        </Link>{' '}
                        source for documentation.
                    </div>
                    <LemonSelect
                        placeholder={'Select an example JSON query'}
                        options={Object.entries(stringifiedQueryExamples).map(([k, v]) => {
                            return { label: k, value: v }
                        })}
                        onChange={(v) => {
                            if (v) {
                                setQueryInput(v)
                                saveQuery()
                            }
                        }}
                    />
                </div>
            ) : null}
            <div
                data-attr="query-editor"
                className={clsx('flex flex-col p-2 bg-border space-y-2 resize-y overflow-auto h-80', props.className)}
            >
                <div className="flex-1">
                    <AutoSizer disableWidth>
                        {({ height }) => (
                            <MonacoEditor
                                theme="vs-light"
                                className="border"
                                language="json"
                                value={queryInput}
                                onChange={(v) => setQueryInput(v ?? '')}
                                height={height}
                                loading={<Spinner />}
                            />
                        )}
                    </AutoSizer>
                </div>
                {error ? (
                    <div className="bg-danger text-white p-2">
                        <strong>Error parsing JSON:</strong> {error}
                    </div>
                ) : null}
                <LemonButton
                    onClick={saveQuery}
                    type="primary"
                    status={error ? 'danger' : 'muted-alt'}
                    disabled={!props.setQuery || !!error || !inputChanged}
                    fullWidth
                    center
                >
                    {!props.setQuery ? 'No permission to update' : 'Update'}
                </LemonButton>
            </div>
        </>
    )
}
