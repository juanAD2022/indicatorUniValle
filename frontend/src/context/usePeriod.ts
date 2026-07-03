import { useContext } from 'react';
import { PeriodContext } from './PeriodContext';

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error('usePeriod must be used within a PeriodProvider');
  }
  return context;
};
