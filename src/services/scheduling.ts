export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // Added priority field
  remainingTime: number;
  completionTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  startTime?: number;
}

export interface GanttStep {
  processId: string;
  startTime: number;
  endTime: number;
}

export const runFCFS = (processes: Process[]): { gantt: GanttStep[], metrics: Process[] } => {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const gantt: GanttStep[] = [];
  let currentTime = 0;
  
  const results = sorted.map(p => {
    if (currentTime < p.arrivalTime) {
      currentTime = p.arrivalTime;
    }
    
    const startTime = currentTime;
    currentTime += p.burstTime;
    const completionTime = currentTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    
    gantt.push({ processId: p.id, startTime, endTime: completionTime });
    
    return { ...p, startTime, completionTime, turnaroundTime, waitingTime };
  });
  
  return { gantt, metrics: results };
};

export const runSJF = (processes: Process[]): { gantt: GanttStep[], metrics: Process[] } => {
  let currentTime = 0;
  const gantt: GanttStep[] = [];
  const readyQueue: Process[] = [];
  const completed: Process[] = [];
  let unvisited = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  while (unvisited.length > 0 || readyQueue.length > 0) {
    // Add arrived processes
    while (unvisited.length > 0 && unvisited[0].arrivalTime <= currentTime) {
      readyQueue.push(unvisited.shift()!);
    }
    
    if (readyQueue.length === 0) {
      currentTime = unvisited[0].arrivalTime;
      continue;
    }
    
    // Sort by burst time (Shortest Job First)
    readyQueue.sort((a, b) => a.burstTime - b.burstTime);
    
    const p = readyQueue.shift()!;
    const startTime = currentTime;
    currentTime += p.burstTime;
    const completionTime = currentTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    
    gantt.push({ processId: p.id, startTime, endTime: completionTime });
    completed.push({ ...p, startTime, completionTime, turnaroundTime, waitingTime });
  }
  
  return { gantt, metrics: completed };
};

export const runRR = (processes: Process[], quantum: number): { gantt: GanttStep[], metrics: Process[] } => {
  let currentTime = 0;
  const gantt: GanttStep[] = [];
  const queue: Process[] = [];
  const results: Process[] = [];
  let unvisited = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const processStates = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  
  while (unvisited.length > 0 || queue.length > 0) {
    // Add arrived processes
    while (unvisited.length > 0 && unvisited[0].arrivalTime <= currentTime) {
      const p = unvisited.shift()!;
      queue.push(processStates.find(ps => ps.id === p.id)!);
    }
    
    if (queue.length === 0) {
      currentTime = unvisited[0].arrivalTime;
      continue;
    }
    
    const p = queue.shift()!;
    const startTime = currentTime;
    const executionTime = Math.min(p.remainingTime, quantum);
    
    currentTime += executionTime;
    p.remainingTime -= executionTime;
    
    gantt.push({ processId: p.id, startTime, endTime: currentTime });
    
    // Add any processes that arrived during this quantum
    while (unvisited.length > 0 && unvisited[0].arrivalTime <= currentTime) {
      const np = unvisited.shift()!;
      queue.push(processStates.find(ps => ps.id === np.id)!);
    }
    
    if (p.remainingTime > 0) {
      queue.push(p);
    } else {
      p.completionTime = currentTime;
      p.turnaroundTime = p.completionTime - p.arrivalTime;
      p.waitingTime = p.turnaroundTime - p.burstTime;
      results.push(p);
    }
  }
  
  return { gantt, metrics: results };
};

export const runPriority = (processes: Process[]): { gantt: GanttStep[], metrics: Process[] } => {
  let currentTime = 0;
  const gantt: GanttStep[] = [];
  const readyQueue: Process[] = [];
  const completed: Process[] = [];
  let unvisited = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  while (unvisited.length > 0 || readyQueue.length > 0) {
    // Add arrived processes to ready queue
    while (unvisited.length > 0 && unvisited[0].arrivalTime <= currentTime) {
      readyQueue.push(unvisited.shift()!);
    }
    
    if (readyQueue.length === 0) {
      currentTime = unvisited[0].arrivalTime;
      continue;
    }
    
    // Sort by priority (Lower number = Higher priority)
    // Secondary sort by arrival time for consistency
    readyQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.arrivalTime - b.arrivalTime;
    });
    
    const p = readyQueue.shift()!;
    const startTime = currentTime;
    currentTime += p.burstTime;
    const completionTime = currentTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    
    gantt.push({ processId: p.id, startTime, endTime: completionTime });
    completed.push({ ...p, startTime, completionTime, turnaroundTime, waitingTime });
  }
  
  return { gantt, metrics: completed };
};
