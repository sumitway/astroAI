import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChartData } from '@components/charts/SouthIndianChart';

type ChartStyle = 'south' | 'north';
type AyanamsaType = 'lahiri' | 'raman' | 'kp' | 'true_citra';

interface ChartState {
  activeChart: ChartData | null;
  chartStyle: ChartStyle;
  ayanamsa: AyanamsaType;
  activeDivision: string;
  showDegrees: boolean;
  showHouseNumbers: boolean;
  divisionalCharts: Record<string, ChartData>;
}

const initialState: ChartState = {
  activeChart: null,
  chartStyle: 'south',
  ayanamsa: 'lahiri',
  activeDivision: 'D1',
  showDegrees: false,
  showHouseNumbers: true,
  divisionalCharts: {},
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setActiveChart(state, action: PayloadAction<ChartData>) {
      state.activeChart = action.payload;
    },
    setChartStyle(state, action: PayloadAction<ChartStyle>) {
      state.chartStyle = action.payload;
    },
    setAyanamsa(state, action: PayloadAction<AyanamsaType>) {
      state.ayanamsa = action.payload;
    },
    setActiveDivision(state, action: PayloadAction<string>) {
      state.activeDivision = action.payload;
    },
    toggleShowDegrees(state) {
      state.showDegrees = !state.showDegrees;
    },
    toggleShowHouseNumbers(state) {
      state.showHouseNumbers = !state.showHouseNumbers;
    },
    setDivisionalChart(state, action: PayloadAction<{ division: string; chart: ChartData }>) {
      state.divisionalCharts[action.payload.division] = action.payload.chart;
    },
    clearDivisionalCharts(state) {
      state.divisionalCharts = {};
    },
  },
});

export const {
  setActiveChart, setChartStyle, setAyanamsa, setActiveDivision,
  toggleShowDegrees, toggleShowHouseNumbers, setDivisionalChart, clearDivisionalCharts,
} = chartSlice.actions;

export default chartSlice.reducer;
