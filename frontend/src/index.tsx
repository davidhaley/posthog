import '~/styles'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { getContext } from 'kea'

import { App } from 'scenes/App'
import { initKea } from './initKea'

import { loadPostHogJS } from './loadPostHogJS'
import { ErrorBoundary } from './layout/ErrorBoundary'

import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { App as AntdApp, ConfigProvider } from 'antd'
import theme from './styles/antd-theme'

loadPostHogJS()
initKea()

// Expose `window.getReduxState()` to make snapshots to storybook easy
if (typeof window !== 'undefined') {
    // Disabled in production to prevent leaking secret data, personal API keys, etc
    if (process.env.NODE_ENV === 'development') {
        ;(window as any).getReduxState = () => getContext().store.getState()
    } else {
        ;(window as any).getReduxState = () => 'Disabled outside development!'
    }
}

function renderApp(): void {
    const root = document.getElementById('root')
    if (root) {
        ReactDOM.render(
            <StrictMode>
                <ConfigProvider theme={theme}>
                    <AntdApp>
                        <ErrorBoundary>
                            <PostHogProvider client={posthog}>
                                <App />
                            </PostHogProvider>
                        </ErrorBoundary>
                    </AntdApp>
                </ConfigProvider>
            </StrictMode>,
            root
        )
    } else {
        console.error('Attempted, but could not render PostHog app because <div id="root" /> is not found.')
    }
}

// Render react only when DOM has loaded - javascript might be cached and loaded before the page is ready.
if (document.readyState !== 'loading') {
    renderApp()
} else {
    document.addEventListener('DOMContentLoaded', renderApp)
}
