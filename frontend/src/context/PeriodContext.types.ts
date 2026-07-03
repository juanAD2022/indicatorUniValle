export interface PeriodContextType {
  selectedPeriod: string | null;
  setSelectedPeriod: (periodo: string | null) => void;
  availablePeriods: string[];
  setAvailablePeriods: (periods: string[]) => void;
}
