import { clsx } from 'clsx';

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={clsx('flex gap-1 p-1 rounded-lg bg-pastel-blue/20 border border-pastel-blue/30', className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:bg-white/50'
          )}
        >
          {tab.label}
          {tab.count != null && (
            <span className={clsx('ml-1.5', activeTab === tab.id ? 'text-dmless-primary' : 'text-gray-500')}>
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
