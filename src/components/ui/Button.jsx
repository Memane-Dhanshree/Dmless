import { clsx } from 'clsx';

const variants = {
  primary: 'bg-dmless-primary text-gray-900 hover:bg-pastel-blueDark border border-pastel-blueDark/50',
  secondary: 'bg-pastel-yellow text-gray-800 hover:bg-pastel-yellowDark border border-pastel-yellowDark/50',
  danger: 'bg-pastel-red text-gray-800 hover:bg-pastel-redDark border border-pastel-redDark/50',
  ghost: 'bg-transparent hover:bg-pastel-blue/30 border border-transparent',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dmless-primary disabled:opacity-50 disabled:pointer-events-none',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
