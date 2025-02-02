import { getSeriesColor } from 'lib/colors'
import { alphabet, hexToRGBA } from 'lib/utils'

interface SeriesGlyphProps {
    className?: string
    children: React.ReactNode
    style?: React.CSSProperties
    variant?: 'funnel-step-glyph' // Built-in styling defaults
}

export function SeriesGlyph({ className, style, children, variant }: SeriesGlyphProps): JSX.Element {
    return (
        // eslint-disable-next-line react/forbid-dom-props
        <div className={`graph-series-glyph ${variant || ''} ${className}`} style={style}>
            {children}
        </div>
    )
}

interface SeriesLetterProps {
    className?: string
    hasBreakdown: boolean
    seriesIndex: number
    seriesColor?: string
}

export function SeriesLetter({ className, hasBreakdown, seriesIndex, seriesColor }: SeriesLetterProps): JSX.Element {
    const color = seriesColor || getSeriesColor(seriesIndex)

    return (
        <SeriesGlyph
            className={className}
            style={
                !hasBreakdown
                    ? {
                          borderColor: color,
                          color: color,
                          backgroundColor: hexToRGBA(color, 0.15),
                      }
                    : {
                          color: 'var(--default)',
                      }
            }
        >
            {alphabet[seriesIndex]}
        </SeriesGlyph>
    )
}
