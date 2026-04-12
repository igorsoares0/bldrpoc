type BadgeVariant = 'default' | 'success' | 'warning'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-2 text-text-secondary',
  success: 'bg-success/15 text-success',
  warning: 'bg-amber-500/15 text-amber-400',
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: BadgeVariant
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}
