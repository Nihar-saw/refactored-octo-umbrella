export interface DeadlockState {
  processes: string[];
  resourceTypes: string[];
  allocation: number[][];
  max: number[][];
  available: number[];
}

export interface SafetyResult {
  isSafe: boolean;
  sequence: string[];
  steps: Array<{
    processId: string;
    work: number[];
    need: number[];
    allocation: number[];
    newWork: number[];
    isPossible: boolean;
  }>;
}

export const calculateNeed = (allocation: number[][], max: number[][]): number[][] => {
  return max.map((row, i) => row.map((val, j) => val - allocation[i][j]));
};

export const checkSafety = (state: DeadlockState): SafetyResult => {
  const { processes, allocation, max, available } = state;
  const n = processes.length;
  const m = available.length;
  const need = calculateNeed(allocation, max);
  
  const work = [...available];
  const finish = new Array(n).fill(false);
  const sequence: string[] = [];
  const steps: SafetyResult['steps'] = [];
  
  let count = 0;
  while (count < n) {
    let found = false;
    for (let i = 0; i < n; i++) {
      if (!finish[i]) {
        const canAllocate = need[i].every((val, j) => val <= work[j]);
        
        if (canAllocate) {
          const oldWork = [...work];
          for (let j = 0; j < m; j++) {
            work[j] += allocation[i][j];
          }
          finish[i] = true;
          sequence.push(processes[i]);
          steps.push({
            processId: processes[i],
            work: oldWork,
            need: need[i],
            allocation: allocation[i],
            newWork: [...work],
            isPossible: true
          });
          found = true;
          count++;
        }
      }
    }
    
    if (!found) break;
  }
  
  const isSafe = count === n;
  
  return {
    isSafe,
    sequence,
    steps
  };
};

export const requestResources = (
  state: DeadlockState,
  processIndex: number,
  request: number[]
): { granted: boolean; newState?: DeadlockState; reason?: string } => {
  const need = calculateNeed(state.allocation, state.max);
  
  // 1. Check if request <= need
  if (request.some((val, j) => val > need[processIndex][j])) {
    return { granted: false, reason: "Request exceeds maximum claim (Need)." };
  }
  
  // 2. Check if request <= available
  if (request.some((val, j) => val > state.available[j])) {
    return { granted: false, reason: "Resources not available (Wait)." };
  }
  
  // 3. Pretend to allocate
  const nextAvailable = state.available.map((val, j) => val - request[j]);
  const nextAllocation = state.allocation.map((row, i) => 
    i === processIndex ? row.map((val, j) => val + request[j]) : [...row]
  );
  
  const nextState: DeadlockState = {
    ...state,
    available: nextAvailable,
    allocation: nextAllocation
  };
  
  const safetyCheck = checkSafety(nextState);
  
  if (safetyCheck.isSafe) {
    return { granted: true, newState: nextState };
  } else {
    return { granted: false, reason: "Request would lead to an unsafe state." };
  }
};
