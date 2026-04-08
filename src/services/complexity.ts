export type ComplexityType = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n^2)';

export interface ComplexityInfo {
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: string;
  reason: string;
  type: ComplexityType;
}

export const complexityData: Record<string, ComplexityInfo> = {
  // Scheduling
  'FCFS': {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(1)',
    reason: 'First-Come First-Served process list is traversed once to calculate metrics.',
    type: 'O(n)'
  },
  'SJF': {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(1)',
    reason: 'Shortest Job First requires sorting the ready queue whenever a process finishes.',
    type: 'O(n log n)'
  },
  'Priority': {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(1)',
    reason: 'Priority scheduling requires sorting processes in the ready queue based on priority levels.',
    type: 'O(n log n)'
  },
  'RR': {
    time: { best: 'O(n)', average: 'O(n \u00d7 q)', worst: 'O(n^2)' },
    space: 'O(n)',
    reason: 'Round Robin involves multiple context switches. In worst case (small quantum), it approaches quadratic complexity.',
    type: 'O(n^2)'
  },
  // Page Replacement
  'FIFO': {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(f)',
    reason: 'FIFO uses a simple queue to track page entrance. Each page reference is handled in constant time relative to frames.',
    type: 'O(n)'
  },
  'LRU': {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(f)',
    reason: 'LRU tracks access order. With a hash map + doubly linked list, each access is O(1), leading to O(n) total.',
    type: 'O(n)'
  },
  'OPTIMAL': {
    time: { best: 'O(n)', average: 'O(n \u00d7 f)', worst: 'O(n \u00d7 f)' },
    space: 'O(f)',
    reason: 'Optimal replacement scans future references for each fault to find the best page to replace.',
    type: 'O(n)' // Usually treated as linear over string length if frames f is fixed
  },
  // Deadlock
  'Bankers': {
    time: { best: 'O(n^2 \u00d7 m)', average: 'O(n^2 \u00d7 m)', worst: 'O(n^2 \u00d7 m)' },
    space: 'O(n \u00d7 m)',
    reason: 'Bankers algorithm iterates through n processes, each requiring a check of m resource types across the list.',
    type: 'O(n^2)'
  }
};

export const getComplexityCurve = (type: ComplexityType, n: number): number => {
  switch (type) {
    case 'O(1)': return 1;
    case 'O(log n)': return Math.log2(n + 1);
    case 'O(n)': return n;
    case 'O(n log n)': return n * Math.log2(n + 1);
    case 'O(n^2)': return n * n;
    default: return n;
  }
};

export const generateGraphData = (_inputSize: number) => {
  const labels = Array.from({ length: 11 }, (_, i) => i * 10 || 1);
  const types: ComplexityType[] = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'];
  
  return {
    labels,
    datasets: types.map(type => ({
      label: type,
      data: labels.map(l => getComplexityCurve(type, l)),
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
      tension: 0.4,
      type
    }))
  };
};
