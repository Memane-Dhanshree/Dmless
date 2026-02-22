import { clsx } from 'clsx';

export function StepIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isComplete = currentStep > i + 1;
          const isCurrent = currentStep === i + 1;
          return (
            <li
              key={step}
              className={clsx(
                'flex flex-1 items-center',
                i < steps.length - 1 && 'pr-2 sm:pr-4'
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="flex flex-col items-center flex-1">
                <div
                  className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2',
                    isComplete && 'bg-pastel-green border-pastel-greenDark text-gray-800',
                    isCurrent && 'bg-dmless-primary border-dmless-primary text-gray-900',
                    !isComplete && !isCurrent && 'border-pastel-blue/50 bg-white text-gray-500'
                  )}
                >
                  {isComplete ? '✓' : i + 1}
                </div>
                <span
                  className={clsx(
                    'mt-2 text-xs font-medium hidden sm:block',
                    isCurrent ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={clsx(
                    'flex-1 h-0.5 mx-2',
                    isComplete ? 'bg-pastel-green' : 'bg-pastel-blue/30'
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
