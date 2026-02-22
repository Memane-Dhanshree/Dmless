import { clsx } from 'clsx';

export function Input({
  label,
  error,
  type = 'text',
  className,
  id,
  required,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-pastel-redDark">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dmless-primary focus:border-transparent',
          error ? 'border-pastel-redDark' : 'border-pastel-blue/50',
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-pastel-redDark" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({ label, error, options, className, id, required, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-pastel-redDark">*</span>}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={!!error}
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-dmless-primary focus:border-transparent',
          error ? 'border-pastel-redDark' : 'border-pastel-blue/50',
          className
        )}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-pastel-redDark" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
