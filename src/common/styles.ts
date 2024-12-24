export const breakpoints: breakpointsTypes = {
  xs: 500,
  sm: 850,
  md: 1000,
  lg: 1275,
  xl: 1800,
};

export type breakpointsTypes = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type globalMediaQueriesType = {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  larger_than_xl: boolean;
};
