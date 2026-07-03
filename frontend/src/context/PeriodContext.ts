import { createContext } from 'react';
import type { PeriodContextType } from './PeriodContext.types';

export const PeriodContext = createContext<PeriodContextType | undefined>(undefined);
