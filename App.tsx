
import React, { useState, useEffect, useCallback } from 'react';
import { Gender, UserInput, BMIResult } from './types';
import { getBMIResult } from './services/bmiDataService';
import { getHealthInsights } from './services/geminiService';
import BMIChart from './components/BMIChart';

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    age: 25,
    months: 0,
    gender: Gender.Male,
    weight: 70,
    height: 175
  });

  const [result, setResult] = useState<BMIResult | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const calculate = useCallback(() => {
    const res = getBMIResult(input);
    setResult(res);
  }, [input]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const fetchInsights = async () => {
    if (!result) return;
    setIsLoadingInsights(true);
    const text = await getHealthInsights(result, input);
    setInsights(text);
    setIsLoadingInsights(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2 justify-center md:justify-start">
          <span className="bg-blue-600 text-white p-2 rounded-lg">HP</span>
          HealthPath BMI Tracker
        </h1>
        <p className="text-slate-500 mt-2">Professional BMI analysis for adults and children (2-20 years)</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
          <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setInput(prev => ({ ...prev, gender: Gender.Male }))}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${input.gender === Gender.Male ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Male
            </button>
            <button 
              onClick={() => setInput(prev => ({ ...prev, gender: Gender.Female }))}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${input.gender === Gender.Female ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500'}`}
            >
              Female
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Age (Years)</label>
              <input 
                type="number" 
                value={input.age} 
                onChange={e => setInput(p => ({ ...p, age: Math.max(2, parseInt(e.target.value) || 0) }))}
                className="w-full bg-slate-50 border-0 rounded-lg p-3 text-lg font-medium outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Months</label>
              <input 
                type="number" 
                max={11}
                min={0}
                value={input.months} 
                onChange={e => setInput(p => ({ ...p, months: Math.min(11, Math.max(0, parseInt(e.target.value) || 0)) }))}
                className="w-full bg-slate-50 border-0 rounded-lg p-3 text-lg font-medium outline-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-400 uppercase">Height (cm)</label>
              <span className="text-sm font-bold text-slate-600">{input.height} cm</span>
            </div>
            <input 
              type="range" 
              min={90} 
              max={220} 
              value={input.height}
              onChange={e => setInput(p => ({ ...p, height: parseInt(e.target.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-400 uppercase">Weight (kg)</label>
              <span className="text-sm font-bold text-slate-600">{input.weight} kg</span>
            </div>
            <input 
              type="range" 
              min={10} 
              max={200} 
              value={input.weight}
              onChange={e => setInput(p => ({ ...p, weight: parseInt(e.target.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm leading-relaxed">
            <p><strong>Did you know?</strong> BMI for children and teens is compared to others of the same age and sex. We use the latest CDC growth chart data.</p>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {result && (
            <>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your Result</h2>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-6xl font-black text-slate-900">{result.bmi.toFixed(1)}</span>
                    <span className="text-xl font-medium text-slate-500">kg/m²</span>
                  </div>
                  <div className={`mt-2 text-xl font-bold ${result.colorClass}`}>
                    {result.category}
                  </div>
                  {result.isChild && (
                    <div className="text-slate-500 font-medium mt-1">
                      {result.percentile?.toFixed(0)}th percentile
                    </div>
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="w-24 h-24 rounded-full border-8 border-slate-100 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-full ${result.colorClass.replace('text', 'bg')} opacity-20`}></div>
                  </div>
                </div>
              </div>

              {result.isChild && (
                <BMIChart input={input} result={result} />
              )}

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Health Insights
                  </h3>
                  <button 
                    onClick={fetchInsights}
                    disabled={isLoadingInsights}
                    className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isLoadingInsights ? 'Thinking...' : 'Get Personalized Insights'}
                  </button>
                </div>
                
                {insights ? (
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm">
                    {insights.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">Click the button above to generate AI insights based on your BMI result.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs">
        <p>BMI calculation based on weight (kg) / height (m)². Growth data sourced from CDC 2-20 Years Growth Charts.</p>
        <p className="mt-1">This tool is for informational purposes only and does not constitute medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
