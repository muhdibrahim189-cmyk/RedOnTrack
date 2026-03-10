/**
 * Hook for managing analytics state and calculations
 * Follows Single Responsibility - only handles analytics state and logic
 */

import { useState, useMemo } from 'react';
import { AccidentStat, DateRange } from '../domain';
import { analyticsService } from '../services';

interface UseAccidentAnalyticsReturn {
  period: 'weekly' | 'monthly';
  setPeriod: (period: 'weekly' | 'monthly') => void;
  dimension: 'day' | 'time';
  setDimension: (dimension: 'day' | 'time') => void;
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
  currentStats: AccidentStat[];
  totalCases: number;
  maxValue: number;
  dateRangeLabel: string;
  trendPercentage: string;
  isTrendUp: boolean;
  dateRange: DateRange;
}

export function useAccidentAnalytics(): UseAccidentAnalyticsReturn {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [dimension, setDimension] = useState<'day' | 'time'>('day');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const currentStats = useMemo(() => {
    if (period === 'weekly') {
      return analyticsService.getStatsForWeek(weekOffset, dimension);
    } else {
      // Mock monthly data (extend based on requirements)
      return dimension === 'day'
        ? [
            { label: 'Mon', value: 12 },
            { label: 'Tue', value: 8 },
            { label: 'Wed', value: 22 },
            { label: 'Thu', value: 14 },
            { label: 'Fri', value: 28 },
            { label: 'Sat', value: 32 },
            { label: 'Sun', value: 10 },
          ]
        : [
            { label: '05-08', value: 35 },
            { label: '09-12', value: 45 },
            { label: '13-16', value: 62 },
            { label: '17-20', value: 88 },
            { label: '21-00', value: 25 },
          ];
    }
  }, [period, dimension, weekOffset]);

  const totalCases = useMemo(
    () => accidentService.calculateTotalAccidents(currentStats),
    [currentStats]
  );

  const maxValue = useMemo(
    () => accidentService.getMaxStatValue(currentStats),
    [currentStats]
  );

  const dateRange = useMemo(
    () => analyticsService.calculateDateRangeForWeek(weekOffset),
    [weekOffset]
  );

  const dateRangeLabel = useMemo(
    () => analyticsService.formatDateRange(dateRange),
    [dateRange]
  );

  const trend = useMemo(() => analyticsService.calculateTrend(period), [period]);

  return {
    period,
    setPeriod,
    dimension,
    setDimension,
    weekOffset,
    setWeekOffset,
    selectedFilter,
    setSelectedFilter,
    currentStats,
    totalCases,
    maxValue,
    dateRangeLabel,
    trendPercentage: trend.percentage,
    isTrendUp: trend.isUp,
    dateRange,
  };
}

// Need to import accidentService here but avoiding circular dependency
import { accidentService } from '../services';
