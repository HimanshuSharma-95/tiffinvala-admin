'use client'

interface SubtleSpinnerProps {
    size?: number
    className?: string
}

export default function SubtleSpinner({
    size = 14,
    className = '',
}: SubtleSpinnerProps) {
    return (
        <div
            className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
            style={{
                width: size,
                height: size,
            }}
        />
    )
}