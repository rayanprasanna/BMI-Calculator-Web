
import { BMIDataRow, Gender, BMIResult, UserInput } from "../types";
import { RAW_BMI_DATA } from "../constants/bmiData";

/**
 * Standard BMI Calculation: Weight (kg) / [Height (m)]^2
 */
export const calculateBMIValue = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
};

/**
 * Z-score calculation using LMS method:
 * Z = [((BMI / M)**L) - 1] / (L * S)
 */
export const calculateZScore = (bmi: number, L: number, M: number, S: number): number => {
  return (Math.pow(bmi / M, L) - 1) / (L * S);
};

/**
 * Normal Distribution Approximation for Percentile
 */
export const zToPercentile = (z: number): number => {
  if (z < -6.5) return 0.0001;
  if (z > 6.5) return 99.9999;

  const fact1 = 1 / (1 + Math.exp(-0.07056 * Math.pow(z, 3) - 1.5976 * z));
  return fact1 * 100;
};

export const getBMIResult = (input: UserInput): BMIResult => {
  const bmi = calculateBMIValue(input.weight, input.height);
  const totalMonths = input.age * 12 + input.months;
  const isChild = input.age < 20;

  if (!isChild) {
    // Adult Logic
    if (bmi < 18.5) return { bmi, category: 'Underweight', colorClass: 'text-amber-500', isChild: false };
    if (bmi < 25) return { bmi, category: 'Normal', colorClass: 'text-emerald-500', isChild: false };
    if (bmi < 30) return { bmi, category: 'Overweight', colorClass: 'text-orange-500', isChild: false };
    return { bmi, category: 'Obese', colorClass: 'text-red-500', isChild: false };
  }

  // Child Logic (2-20 years)
  // Find nearest data point in the provided growth charts
  const genderData = RAW_BMI_DATA.filter(d => d.sex === input.gender);
  
  // Find the exact match or the closest month
  let closestRow = genderData[0];
  let minDiff = Math.abs(closestRow.agemos - totalMonths);

  for (const row of genderData) {
    const diff = Math.abs(row.agemos - totalMonths);
    if (diff < minDiff) {
      minDiff = diff;
      closestRow = row;
    }
  }

  const z = calculateZScore(bmi, closestRow.L, closestRow.M, closestRow.S);
  const percentile = zToPercentile(z);

  let category = '';
  let colorClass = '';

  if (percentile < 5) {
    category = 'Underweight';
    colorClass = 'text-amber-500';
  } else if (percentile < 85) {
    category = 'Healthy weight';
    colorClass = 'text-emerald-500';
  } else if (percentile < 95) {
    category = 'Overweight';
    colorClass = 'text-orange-500';
  } else {
    category = 'Obese';
    colorClass = 'text-red-500';
  }

  return { bmi, category, percentile, isChild: true, colorClass };
};
