import { LemonInput } from '@posthog/lemon-ui'
import { useActions, useValues } from 'kea'
import { CommandFlow } from 'lib/components/CommandPalette/commandPaletteLogic'
import { IconChevronRight, IconEdit } from 'lib/lemon-ui/icons'
import React from 'react'

import { KeyboardShortcut } from '~/layout/navigation-3000/components/KeyboardShortcut'

import { actionBarLogic } from './actionBarLogic'

type PrefixIconProps = {
    activeFlow: CommandFlow | null
}
const PrefixIcon = ({ activeFlow }: PrefixIconProps): React.ReactElement | null => {
    if (activeFlow) {
        return <activeFlow.icon className="palette__icon" /> ?? <IconEdit className="palette__icon" />
    } else {
        return <IconChevronRight className="palette__icon" />
    }
}

const ActionInput = (): JSX.Element => {
    const { input, activeFlow } = useValues(actionBarLogic)
    const { setInput } = useActions(actionBarLogic)

    return (
        <div className="border-b">
            <LemonInput
                size="small"
                className="CommandBar__input"
                fullWidth
                prefix={<PrefixIcon activeFlow={activeFlow} />}
                suffix={<KeyboardShortcut escape muted />}
                placeholder={activeFlow?.instruction ?? 'What would you like to do? Try some suggestions…'}
                autoFocus
                value={input}
                onChange={setInput}
            />
        </div>
    )
}

export default ActionInput
