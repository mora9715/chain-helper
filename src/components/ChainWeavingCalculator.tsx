import { useState } from 'react';
import { InputField } from './InputField';
import { convertToMM, type ConverterUnit } from '../constants/wireGauges';

type FieldKey = 'wireD' | 'innerD' | 'outerD' | 'aspectR';

interface CalculatorValues {
  wireD: string;
  innerD: string;
  outerD: string;
  aspectR: string;
}

function calculateValues(values: CalculatorValues, lockedFields: FieldKey[]): CalculatorValues {
  const wd = parseFloat(values.wireD);
  const id = parseFloat(values.innerD);
  const od = parseFloat(values.outerD);
  const ar = parseFloat(values.aspectR);

  const has = {
    wd: !isNaN(wd) && wd > 0 && lockedFields.includes('wireD'),
    id: !isNaN(id) && id > 0 && lockedFields.includes('innerD'),
    od: !isNaN(od) && od > 0 && lockedFields.includes('outerD'),
    ar: !isNaN(ar) && ar > 0 && lockedFields.includes('aspectR')
  };

  const result = { ...values };

  if (has.wd && has.id) {
    result.aspectR = (id / wd).toFixed(1);
    result.outerD = (id + 2 * wd).toFixed(1);
  } else if (has.wd && has.od) {
    const newId = od - 2 * wd;
    if (newId > 0) {
      result.innerD = newId.toFixed(1);
      result.aspectR = (newId / wd).toFixed(1);
    }
  } else if (has.wd && has.ar) {
    const newId = ar * wd;
    result.innerD = newId.toFixed(1);
    result.outerD = (newId + 2 * wd).toFixed(1);
  } else if (has.id && has.od) {
    const newWd = (od - id) / 2;
    if (newWd > 0) {
      result.wireD = newWd.toFixed(1);
      result.aspectR = (id / newWd).toFixed(1);
    }
  } else if (has.id && has.ar) {
    if (ar > 0) {
      const newWd = id / ar;
      result.wireD = newWd.toFixed(1);
      result.outerD = (id + 2 * newWd).toFixed(1);
    }
  } else if (has.od && has.ar) {
    if (ar > -2) {
      const newWd = od / (ar + 2);
      const newId = ar * newWd;
      if (newWd > 0 && newId > 0) {
        result.wireD = newWd.toFixed(1);
        result.innerD = newId.toFixed(1);
      }
    }
  }

  return result;
}

export function ChainWeavingCalculator() {
  const [values, setValues] = useState<CalculatorValues>({
    wireD: '',
    innerD: '',
    outerD: '',
    aspectR: ''
  });

  const [lockedFields, setLockedFields] = useState<FieldKey[]>([]);

  // Converter state
  const [converterUnit, setConverterUnit] = useState<ConverterUnit>('swg');
  const [converterInput, setConverterInput] = useState('');

  const handleChange = (field: string, value: string) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const fieldKey = field as FieldKey;
    const newLocked = [...lockedFields];
    if (!newLocked.includes(fieldKey)) {
      newLocked.push(fieldKey);
    }
    if (newLocked.length > 2) {
      newLocked.shift();
    }
    setLockedFields(newLocked);

    const newValues = { ...values, [field]: value };
    const calculated = calculateValues(newValues, newLocked);

    calculated[fieldKey] = value;
    setValues(calculated);
  };

  const clearAll = () => {
    setValues({ wireD: '', innerD: '', outerD: '', aspectR: '' });
    setLockedFields([]);
  };

  const convertedValue = convertToMM(converterInput, converterUnit);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="px-4 py-6 sm:py-12">
        <div className="max-w-lg mx-auto space-y-4 sm:space-y-6">

          {/* Header */}
          <header className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 ring-1 ring-slate-800 mb-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Chain Weaving</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 mb-1">
              Ring Calculator
            </h1>

            <p className="text-xs text-slate-500 font-medium">
              Enter any two values to calculate the rest
            </p>
          </header>

          {/* Calculator Card */}
          <div className="bg-slate-900 rounded-2xl shadow-lg ring-1 ring-slate-800 overflow-hidden">

            {/* Card header */}
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Dimensions</span>
              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-200
                         bg-slate-800 hover:bg-slate-700 rounded-full transition-colors
                         ring-1 ring-slate-700 hover:ring-slate-600 uppercase tracking-wide"
              >
                Clear
              </button>
            </div>

            {/* Input fields */}
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2">
                <InputField
                  label="Wire Diameter"
                  field="wireD"
                  unit="mm"
                  value={values.wireD}
                  isLocked={lockedFields.includes('wireD')}
                  onChange={handleChange}
                />
                <InputField
                  label="Inner Diameter"
                  field="innerD"
                  unit="mm"
                  value={values.innerD}
                  isLocked={lockedFields.includes('innerD')}
                  onChange={handleChange}
                />
                <InputField
                  label="Outer Diameter"
                  field="outerD"
                  unit="mm"
                  value={values.outerD}
                  isLocked={lockedFields.includes('outerD')}
                  onChange={handleChange}
                />
                <InputField
                  label="Aspect Ratio"
                  field="aspectR"
                  unit="AR"
                  value={values.aspectR}
                  isLocked={lockedFields.includes('aspectR')}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Tip */}
            <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 text-center font-medium">
                <span className="text-slate-400 font-bold">Tip:</span> Last two edited fields become inputs
              </p>
            </div>
          </div>

          {/* Unit Converter Card */}
          <div className="bg-slate-900 rounded-2xl shadow-lg ring-1 ring-slate-800 overflow-hidden">

            {/* Card header */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Unit Converter</span>
            </div>

            <div className="p-3 space-y-3">
              {/* Unit selector */}
              <div className="flex gap-2">
                {[
                  { value: 'inches' as const, label: 'Inches' },
                  { value: 'swg' as const, label: 'SWG' },
                  { value: 'awg' as const, label: 'AWG' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setConverterUnit(option.value);
                      setConverterInput('');
                    }}
                    className={`
                      flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200
                      ${converterUnit === option.value
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 ring-1 ring-slate-700'}
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Input and output */}
              <div className="grid grid-cols-2 gap-2">
                {/* Input */}
                <div className="rounded-xl p-3 bg-indigo-950 ring-2 ring-indigo-500 shadow-md shadow-indigo-900/50">
                  <label className="block text-[10px] font-semibold tracking-wide text-slate-400 mb-1.5 uppercase">
                    Input
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] bg-indigo-500 text-white font-bold">
                      {converterUnit.toUpperCase()}
                    </span>
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="text"
                      value={converterInput}
                      onChange={(e) => setConverterInput(e.target.value)}
                      placeholder={converterUnit === 'inches' ? '0.0' : '18'}
                      className="w-full bg-transparent text-xl font-medium tracking-tight text-indigo-300 placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Output */}
                <div className="rounded-xl p-3 bg-slate-800 ring-1 ring-slate-700">
                  <label className="block text-[10px] font-semibold tracking-wide text-slate-400 mb-1.5 uppercase">
                    Result
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-medium tracking-tight ${convertedValue ? 'text-slate-100' : 'text-slate-600'}`}>
                      {convertedValue || '—'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info footer */}
            <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 text-center font-medium">
                <span className="text-slate-400 font-bold">Note:</span> Gauge values are wire diameter standards
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
