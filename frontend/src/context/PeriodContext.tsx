import { useState, useCallback, type ReactNode } from 'react';
import { PeriodContext } from './PeriodContext';

export const PeriodProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [availablePeriods, setAvailablePeriodsState] = useState<string[]>([]);

  const setAvailablePeriods = useCallback((periods: string[]) => {
    setAvailablePeriodsState(periods);
  }, []);

  return (
    <PeriodContext.Provider value={{ selectedPeriod, setSelectedPeriod, availablePeriods, setAvailablePeriods }}>
      {children}
    </PeriodContext.Provider>
  );
};
