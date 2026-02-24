
import { useState, useMemo } from 'react';
import { AccidentStat } from '../types';
import { MONTHLY_DAY_STATS, MONTHLY_TIME_STATS } from '../constants';

// Generate dynamic-ish stats based on a seed (week index)
export const getStatsForWeek = (weekIndex: number, dimension: 'day' | 'time'): AccidentStat[] => {
  const seeds = [
    // Week 0 (Current)
    { day: [2, 1, 5, 3, 6, 8, 4], time: [12, 18, 24, 6] },
    // Week 1
    { day: [3, 2, 4, 1, 9, 5, 2], time: [10, 15, 30, 8] },
    // Week 2
    { day: [1, 5, 2, 7, 4, 3, 6], time: [8, 20, 18, 12] },
    // Week 3
    { day: [4, 3, 8, 2, 5, 7, 1], time: [15, 12, 22, 5] },
  ];
  
  const data = seeds[weekIndex] || seeds[0];
  if (dimension === 'day') {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((l, i) => ({ label: l, value: data.day[i] }));
  } else {
    const labels = ['06-12', '12-18', '18-00', '00-06'];
    return labels.map((l, i) => ({ label: l, value: data.time[i] }));
  }
};

export const useAccidentStats = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [dimension, setDimension] = useState<'day' | 'time'>('day');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const currentStats = useMemo(() => {
    if (period === 'weekly') {
      return getStatsForWeek(weekOffset, dimension);
    } else {
      return dimension === 'day' ? MONTHLY_DAY_STATS : MONTHLY_TIME_STATS;
    }
  }, [period, dimension, weekOffset]);

  const totalCases = useMemo(() => currentStats.reduce((acc, curr) => acc + curr.value, 0), [currentStats]);
  const maxValue = useMemo(() => {
    const val = Math.max(...currentStats.map(s => s.value));
    return val > 0 ? val : 1; 
  }, [currentStats]);

  const dateRangeLabel = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() - now.getDay() - (weekOffset * 7) + 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
  }, [weekOffset]);

  const trendPercentage = period === 'weekly' ? '+12%' : '-4%';
  const isTrendUp = trendPercentage.startsWith('+');

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
    trendPercentage,
    isTrendUp
  };
};
