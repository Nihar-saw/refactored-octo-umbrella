export interface PageState {
  frames: (number | null)[];
  isFault: boolean;
  page: number;
}

export const runFIFO = (pages: number[], capacity: number): PageState[] => {
  const frames: (number | null)[] = Array(capacity).fill(null);
  const states: PageState[] = [];
  const queue: number[] = [];
  
  pages.forEach(page => {
    let isFault = false;
    if (!frames.includes(page)) {
      isFault = true;
      if (queue.length < capacity) {
        const emptyIdx = frames.indexOf(null);
        frames[emptyIdx] = page;
        queue.push(page);
      } else {
        const oldest = queue.shift()!;
        const idx = frames.indexOf(oldest);
        frames[idx] = page;
        queue.push(page);
      }
    }
    states.push({ frames: [...frames], isFault, page });
  });
  
  return states;
};

export const runLRU = (pages: number[], capacity: number): PageState[] => {
  const frames: (number | null)[] = Array(capacity).fill(null);
  const states: PageState[] = [];
  const usage: Map<number, number> = new Map();
  
  pages.forEach((page, time) => {
    let isFault = false;
    if (!frames.includes(page)) {
      isFault = true;
      if (frames.includes(null)) {
        const emptyIdx = frames.indexOf(null);
        frames[emptyIdx] = page;
      } else {
        // Find Least Recently Used
        let lruPage = frames[0]!;
        let minTime = usage.get(lruPage) || 0;
        
        frames.forEach(f => {
          const t = usage.get(f!) || 0;
          if (t < minTime) {
            minTime = t;
            lruPage = f!;
          }
        });
        
        const idx = frames.indexOf(lruPage);
        frames[idx] = page;
      }
    }
    usage.set(page, time);
    states.push({ frames: [...frames], isFault, page });
  });
  
  return states;
};
export const runOptimal = (pages: number[], capacity: number): PageState[] => {
  const frames: (number | null)[] = Array(capacity).fill(null);
  const states: PageState[] = [];
  
  pages.forEach((page, time) => {
    let isFault = false;
    if (!frames.includes(page)) {
      isFault = true;
      if (frames.includes(null)) {
        const emptyIdx = frames.indexOf(null);
        frames[emptyIdx] = page;
      } else {
        // Find the page in frames that won't be used for the longest time
        let farthestIndex = -1;
        let replaceIdx = 0;
        
        for (let i = 0; i < frames.length; i++) {
          const currentFramePage = frames[i]!;
          let nextIndex = -1;
          
          // Look ahead in the pages array
          for (let j = time + 1; j < pages.length; j++) {
            if (pages[j] === currentFramePage) {
              nextIndex = j;
              break;
            }
          }
          
          if (nextIndex === -1) {
            replaceIdx = i;
            break;
          }
          
          if (nextIndex > farthestIndex) {
            farthestIndex = nextIndex;
            replaceIdx = i;
          }
        }
        
        frames[replaceIdx] = page;
      }
    }
    states.push({ frames: [...frames], isFault, page });
  });
  
  return states;
};
