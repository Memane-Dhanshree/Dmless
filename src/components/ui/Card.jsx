import { clsx } from 'clsx';

export function Card({ children, className, padding = true, hover, onClick, ...props }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      className={clsx(
        'rounded-xl border border-pastel-blue/50 bg-white shadow-sm',
        padding && 'p-5',
        hover && 'transition hover:shadow-md hover:border-pastel-blueDark/50',
        onClick && 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dmless-primary',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action, className }) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {action}
    </div>
  );
}
