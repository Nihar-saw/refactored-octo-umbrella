export interface QnA {
  question: string;
  answer: string;
}

export interface VideoResource {
  title: string;
  channel: string;
  videoId: string;
  duration: string;
  description: string;
}

export interface LearningContent {
  qna: QnA[];
  videos: VideoResource[];
}

export const learningContent: Record<string, LearningContent> = {
  scheduling: {
    qna: [
      {
        question: "What is CPU Scheduling and why is it needed?",
        answer: "CPU Scheduling is the process of determining which process in the ready queue should be allocated the CPU next. It is needed because multiple processes compete for CPU time, and an OS must manage this fairly and efficiently to maximize utilization, minimize wait times, and ensure system responsiveness."
      },
      {
        question: "What is the difference between preemptive and non-preemptive scheduling?",
        answer: "In non-preemptive scheduling (e.g., FCFS, SJF), once a process starts executing, it cannot be interrupted until it completes or blocks. In preemptive scheduling (e.g., Round Robin, SRTF), the OS can forcibly remove the CPU from a process if a higher-priority or shorter job arrives, or when a time quantum expires."
      },
      {
        question: "What is turnaround time and waiting time?",
        answer: "Turnaround Time (TAT) = Completion Time − Arrival Time. It represents the total time taken from submission to completion.\n\nWaiting Time (WT) = Turnaround Time − Burst Time. It is the total time a process spends waiting in the ready queue before actually executing on the CPU."
      },
      {
        question: "What is the Convoy Effect in FCFS scheduling?",
        answer: "The Convoy Effect occurs when a long-running process holds the CPU while shorter processes queue up behind it. This significantly increases the average waiting time. It is a major drawback of FCFS. Imagine a truck blocking all cars on a single-lane road — that's the convoy effect."
      },
      {
        question: "Why is SJF optimal for minimizing average waiting time?",
        answer: "SJF is provably optimal for non-preemptive scheduling in terms of average waiting time because it always picks the shortest available job. By executing short jobs first, it reduces the waiting time for the majority of processes. However, it can lead to starvation for long processes if short ones keep arriving."
      },
      {
        question: "How does Round Robin ensure fairness?",
        answer: "Round Robin assigns a fixed time slice (quantum) to each process in a cyclic order. No process runs for more than one quantum before giving the CPU to the next. This ensures all processes get CPU time proportionally. The quantum size is critical — too small causes high context-switch overhead; too large degrades into FCFS."
      },
      {
        question: "What is Priority Scheduling and what is starvation?",
        answer: "Priority Scheduling assigns each process a priority number. The CPU always executes the highest-priority (usually lowest number) process first. Starvation occurs when low-priority processes wait indefinitely because higher-priority processes keep arriving. This can be solved using 'aging' — gradually increasing the priority of waiting processes over time."
      }
    ],
    videos: [
      {
        title: "CPU Scheduling Algorithms - FCFS, SJF, Round Robin",
        channel: "Neso Academy",
        videoId: "Jkmy2YLUbUY",
        duration: "12:03",
        description: "Clear explanation of all scheduling algorithms with solved examples."
      },
      {
        title: "CPU Scheduling - Gate Smashers",
        channel: "Gate Smashers",
        videoId: "mDJloOyIc0Y",
        duration: "18:42",
        description: "In-depth walkthrough of FCFS, SJF, Priority, and Round Robin with Gantt charts."
      },
      {
        title: "Round Robin Scheduling Algorithm",
        channel: "Neso Academy",
        videoId: "TxjIlNYRZ5M",
        duration: "14:22",
        description: "Dedicated video on Round Robin with multiple worked examples."
      }
    ]
  },

  'page-replacement': {
    qna: [
      {
        question: "What is a page fault?",
        answer: "A page fault occurs when a process tries to access a page that is not currently loaded in physical memory (RAM). The OS must then retrieve that page from secondary storage (disk), which is very slow compared to memory access. Minimizing page faults is the primary goal of page replacement algorithms."
      },
      {
        question: "What is the difference between FIFO and LRU page replacement?",
        answer: "FIFO (First-In, First-Out) replaces the page that has been in memory the longest, regardless of usage. LRU (Least Recently Used) replaces the page that was accessed least recently, using past behavior as a predictor of future use. LRU generally performs better because it is more context-aware, but requires more overhead to track access history."
      },
      {
        question: "What is Belady's Anomaly?",
        answer: "Belady's Anomaly is a counterintuitive phenomenon where increasing the number of page frames actually results in more page faults for FIFO. It was discovered by László Bélády. LRU and Optimal algorithms do not suffer from this anomaly, making them 'stack algorithms.'"
      },
      {
        question: "Why is the Optimal page replacement algorithm not practical?",
        answer: "The Optimal algorithm (OPT) requires future knowledge — it replaces the page that will not be used for the longest time in the future. Since an OS cannot predict future memory accesses, this algorithm cannot be implemented in practice. It serves as a theoretical benchmark to measure how well real algorithms perform."
      },
      {
        question: "What is the hit ratio and why does it matter?",
        answer: "The hit ratio is the percentage of page accesses that are satisfied from physical memory (hits) without causing a page fault. A higher hit ratio means fewer expensive disk accesses and better overall system performance. Generally, a hit ratio above 70–80% indicates efficient memory utilization."
      },
      {
        question: "What is thrashing?",
        answer: "Thrashing occurs when a process spends more time handling page faults than actually executing useful work. It happens when the OS has too many active processes and not enough physical memory frames to hold their working sets. The CPU utilization drops sharply. Solutions include reducing multiprogramming or using the Working Set Model."
      }
    ],
    videos: [
      {
        title: "Page Replacement Algorithms - FIFO & LRU",
        channel: "Neso Academy",
        videoId: "LKYKp_ZzlvM",
        duration: "16:30",
        description: "Step-by-step explanation of FIFO and LRU with page reference string examples."
      },
      {
        title: "Page Replacement - Belady's Anomaly",
        channel: "Gate Smashers",
        videoId: "m5WhB3i_Tzo",
        duration: "11:58",
        description: "Covers FIFO, LRU, OPT, and demonstrates Belady's Anomaly with solved examples."
      },
      {
        title: "Optimal Page Replacement Algorithm",
        channel: "Jenny's Lectures CS IT",
        videoId: "e9wr3y8BKBY",
        duration: "13:47",
        description: "Clear walkthrough of the Optimal algorithm theory and solved problems."
      }
    ]
  },

  deadlock: {
    qna: [
      {
        question: "What are the four necessary conditions for deadlock?",
        answer: "Deadlock can only occur when ALL four conditions hold simultaneously:\n1. Mutual Exclusion — At least one resource must be held in a non-shareable mode.\n2. Hold and Wait — A process holding one resource waits to acquire more.\n3. No Preemption — Resources cannot be forcibly taken from a process.\n4. Circular Wait — A circular chain of processes exists where each waits for a resource held by the next."
      },
      {
        question: "What is the Banker's Algorithm?",
        answer: "The Banker's Algorithm (by Dijkstra) is a deadlock avoidance algorithm. It treats the OS like a banker who only grants a loan if it can still satisfy the maximum demands of all clients. Before allocating resources, it simulates the allocation and checks if the resulting state is 'safe' — i.e., all processes can still complete in some order."
      },
      {
        question: "What is the difference between a safe and unsafe state?",
        answer: "A Safe State means there exists at least one 'safe sequence' in which all processes can complete using currently available resources plus resources released by completing processes. An Unsafe State means no such sequence exists — deadlock is possible, but not guaranteed. The Banker's Algorithm prevents the system from entering unsafe states."
      },
      {
        question: "What is the difference between deadlock prevention, avoidance, and detection?",
        answer: "Prevention eliminates one of the four necessary conditions (strong guarantee, often restricts resource usage).\nAvoidance dynamically checks each request to ensure safety (Banker's Algorithm — more flexible).\nDetection allows deadlock to occur but periodically checks and recovers from it (least restrictive, but recovery has a cost)."
      },
      {
        question: "How does the safety algorithm work step by step?",
        answer: "1. Initialize Work = Available resources, Finish[i] = false for all processes.\n2. Find a process P_i where Finish[i] = false AND Need_i ≤ Work.\n3. If found: Work = Work + Allocation_i, Finish[i] = true, go to step 2.\n4. If all Finish[i] = true → SAFE STATE. If no such process found → UNSAFE STATE."
      },
      {
        question: "What is resource preemption as a deadlock recovery technique?",
        answer: "Resource Preemption involves forcibly taking a resource away from a process to break a deadlock cycle. The key challenges are: selecting a victim process (minimize cost), rollback (return the process to a safe state), and starvation prevention (ensure the same process isn't always victimized)."
      }
    ],
    videos: [
      {
        title: "Banker's Algorithm - Deadlock Avoidance",
        channel: "Neso Academy",
        videoId: "7gMLNiEz3nw",
        duration: "19:45",
        description: "Complete walkthrough of the Banker's Algorithm with the safety algorithm explained."
      },
      {
        title: "Deadlock - Four Conditions & Handling",
        channel: "Gate Smashers",
        videoId: "Uo0ucfARPIo",
        duration: "15:20",
        description: "Covers deadlock conditions, prevention, avoidance, and detection strategies."
      },
      {
        title: "Resource Allocation Graph & Deadlock",
        channel: "Jenny's Lectures CS IT",
        videoId: "s4jGv67KFNE",
        duration: "12:10",
        description: "Visual explanation of deadlock using resource allocation graphs."
      }
    ]
  }
};
