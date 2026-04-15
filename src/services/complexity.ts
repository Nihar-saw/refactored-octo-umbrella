export type ComplexityType = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n^2)';

export type AlgorithmCategory = 'SCHEDULING' | 'PAGE_REPLACEMENT' | 'DEADLOCK';

export interface ComplexityInfo {
  name: string;
  category: AlgorithmCategory;
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: string;
  reason: string;
  type: ComplexityType;      // Primary Time Complexity Type
  spaceType: ComplexityType; // Space Complexity Type
}

export const complexityData: Record<string, ComplexityInfo> = {
  // Scheduling
  'FCFS': {
    name: 'FCFS',
    category: 'SCHEDULING',
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(1)',
    reason: 'FCFS processes the list linearly. Each process is touched once for scheduling decisions.',
    type: 'O(n)',
    spaceType: 'O(1)'
  },
  'SJF': {
    name: 'SJF (Non-Preemptive)',
    category: 'SCHEDULING',
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(1)',
    reason: 'Requires sorting the ready queue or searching for the minimum burst time task.',
    type: 'O(n log n)',
    spaceType: 'O(1)'
  },
  'SRTF': {
    name: 'SJF (Preemptive)',
    category: 'SCHEDULING',
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(n)',
    reason: 'Shortest Remaining Time First requires frequent sorting or monitoring of the ready queue upon every arrival or time step.',
    type: 'O(n log n)',
    spaceType: 'O(n)'
  },
  'Priority': {
    name: 'Priority Scheduling',
    category: 'SCHEDULING',
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(1)',
    reason: 'Similar to SJF, tasks must be maintained in a priority-sorted order.',
    type: 'O(n log n)',
    spaceType: 'O(1)'
  },
  'RR': {
    name: 'Round Robin',
    category: 'SCHEDULING',
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(n)',
    reason: 'Maintains a FIFO queue of ready processes. Each enqueue/dequeue is O(1), leading to O(n) overall.',
    type: 'O(n)',
    spaceType: 'O(n)'
  },
  // Page Replacement
  'FIFO': {
    name: 'First-In First-Out',
    category: 'PAGE_REPLACEMENT',
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(f)',
    reason: 'Uses a simple queue to manage page frames. Each reference is handled in constant time.',
    type: 'O(n)',
    spaceType: 'O(n)'
  },
  'LRU': {
    name: 'Least Recently Used',
    category: 'PAGE_REPLACEMENT',
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(f)',
    reason: 'Standard LRU can be O(n) with hash + linked list, but searching for victim in simpler implementations is O(n log n).',
    type: 'O(n log n)',
    spaceType: 'O(n)'
  },
  'OPTIMAL': {
    name: 'Optimal Page Replacement',
    category: 'PAGE_REPLACEMENT',
    time: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)' },
    space: 'O(f)',
    reason: 'Scans future references for every page fault to determine the furthest use, leading to quadratic time.',
    type: 'O(n^2)',
    spaceType: 'O(n)'
  },
  // Deadlock
  'Bankers': {
    name: "Banker's Algorithm",
    category: 'DEADLOCK',
    time: { best: 'O(n^2 \u00d7 m)', average: 'O(n^2 \u00d7 m)', worst: 'O(n^2 \u00d7 m)' },
    space: 'O(n \u00d7 m)',
    reason: 'The safety algorithm iterates through n processes, checking m resources for each, potentially repeating n times.',
    type: 'O(n^2)',
    spaceType: 'O(n^2)'
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

export const complexityWeights: Record<ComplexityType, number> = {
  'O(1)': 1,
  'O(log n)': 2,
  'O(n)': 3,
  'O(n log n)': 4,
  'O(n^2)': 5
};

export const getCategoryAlgorithms = (category: AlgorithmCategory) => {
  return Object.values(complexityData).filter(algo => algo.category === category);
};

