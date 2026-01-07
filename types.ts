
export enum Gender {
  Male = 1,
  Female = 2
}

export enum AgeGroup {
  Child = 'child',
  Adult = 'adult'
}

export interface BMIDataRow {
  sex: number;
  agemos: number;
  L: number;
  M: number;
  S: number;
  P5: number;
  P50: number;
  P85: number;
  P95: number;
}

export interface BMIResult {
  bmi: number;
  category: string;
  percentile?: number;
  isChild: boolean;
  colorClass: string;
}

export interface UserInput {
  age: number;
  months: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
}
