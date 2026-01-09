interface InputFieldProps {
  label: string;
  field: string;
  unit: string;
  value: string;
  isLocked: boolean;
  onChange: (field: string, value: string) => void;
}

export function InputField({
  label,
  field,
  unit,
  value,
  isLocked,
  onChange
}: InputFieldProps) {
  return (
    <div className="group">
      <div className={`
        relative rounded-xl transition-all duration-300 p-3
        ${isLocked
          ? 'bg-indigo-950 ring-2 ring-indigo-500 shadow-md shadow-indigo-900/50'
          : 'bg-slate-800 ring-1 ring-slate-700 hover:ring-slate-600'}
      `}>
        <label className="block text-[10px] font-semibold tracking-wide text-slate-400 mb-1.5 uppercase">
          {label}
          {isLocked && (
            <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] bg-indigo-500 text-white font-bold">
              INPUT
            </span>
          )}
        </label>

        <div className="flex items-baseline gap-1">
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder="0.0"
            className={`
              w-full bg-transparent text-xl font-medium tracking-tight
              placeholder:text-slate-600 focus:outline-none
              ${isLocked ? 'text-indigo-300' : 'text-slate-100'}
            `}
          />
          <span className={`text-xs font-bold ${isLocked ? 'text-indigo-400' : 'text-slate-500'}`}>
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
