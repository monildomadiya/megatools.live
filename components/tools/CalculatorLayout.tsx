"use client";

import { useState } from "react";
import { Tool } from "@/types";
import { calculateTool } from "@/lib/calculators";
import { RotateCcw, Copy, Check } from "lucide-react";

export default function CalculatorLayout({ tool }: { tool: Tool }) {
  const [inputs, setInputs] = useState<any>(
    tool.inputs.reduce((acc, input) => ({ ...acc, [input.name]: input.defaultValue || "" }), {})
  );
  const [results, setResults] = useState<any[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateTool(tool.slug, inputs);
    setResults(result);
  };

  const handleReset = () => {
    setInputs(tool.inputs.reduce((acc, input) => ({ ...acc, [input.name]: input.defaultValue || "" }), {}));
    setResults(null);
  };

  const handleCopy = () => {
    if (!results) return;
    const text = results.join(" | ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">
      <div className="p-8">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {tool.inputs.map((input) => (
              <div key={input.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {input.label} {input.unit && <span className="text-gray-400">({input.unit})</span>}
                </label>
                {input.type === 'select' ? (
                  <select
                    value={inputs[input.name]}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border bg-gray-50 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                  >
                    {input.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    placeholder={input.placeholder}
                    value={inputs[input.name]}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border bg-gray-50 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              type="submit"
              className="px-8 h-12 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
            >
              Calculate
            </button>
            <button 
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 h-12 rounded-xl border bg-white font-semibold hover:bg-gray-50 transition"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </form>

        {results && (
          <div className="mt-10 p-8 rounded-2xl bg-primary-50 border border-primary-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary-900">Results</h3>
              <button onClick={handleCopy} className="text-primary-600 hover:text-primary-700 p-2 rounded-lg bg-white shadow-sm flex items-center gap-2 text-sm font-medium">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Results"}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {tool.outputLabels.map((label, idx) => (
                <div key={label}>
                  <div className="text-sm font-medium text-primary-600 mb-1">{label}</div>
                  <div className="text-3xl font-black text-gray-900">{results[idx]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
