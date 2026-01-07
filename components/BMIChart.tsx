
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceDot
} from 'recharts';
import { RAW_BMI_DATA } from '../constants/bmiData';
import { Gender, UserInput, BMIResult } from '../types';

interface BMIChartProps {
  input: UserInput;
  result: BMIResult;
}

const BMIChart: React.FC<BMIChartProps> = ({ input, result }) => {
  // Fix: Corrected property access to use uppercase P5, P50, P85, P95 to match BMIDataRow interface
  const chartData = RAW_BMI_DATA.filter(d => d.sex === input.gender)
    .map(d => ({
      age: d.agemos / 12,
      p5: d.P5,
      p50: d.P50,
      p85: d.P85,
      p95: d.P95,
    }));

  const userAge = input.age + (input.months / 12);

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl shadow-sm border border-slate-100 mt-6">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
        BMI-for-age Growth Chart ({input.gender === Gender.Male ? 'Boys' : 'Girls'})
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="age" 
            type="number" 
            domain={[2, 20]} 
            ticks={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
            unit="y"
          />
          <YAxis domain={[12, 35]} />
          <Tooltip 
            labelFormatter={(val) => `Age: ${val} years`}
          />
          
          <Area type="monotone" dataKey="p95" stroke="#fecaca" fill="#fee2e2" name="95th Percentile" />
          <Area type="monotone" dataKey="p85" stroke="#fed7aa" fill="#ffedd5" name="85th Percentile" />
          <Area type="monotone" dataKey="p50" stroke="#d1fae5" fill="#ecfdf5" name="50th Percentile" />
          <Area type="monotone" dataKey="p5" stroke="#fde68a" fill="#fef3c7" name="5th Percentile" />
          
          <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2} dot={false} />

          {/* User's position */}
          <ReferenceDot 
            x={userAge} 
            y={result.bmi} 
            r={6} 
            fill="#3b82f6" 
            stroke="#fff" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2 text-[10px] font-medium text-slate-400">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-200"></span> Obese</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-200"></span> Overweight</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-100"></span> Healthy</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Your Child</div>
      </div>
    </div>
  );
};

export default BMIChart;
