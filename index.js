const Table = require("cli-table3");

const table = new Table({
  head: ["Task", "t1", "t2", "t3", "t4"],
  style: { head: ["cyan"] },
});

table.push(
  ["Arrival", "5", "15", "10", "0"],
  ["Duration", "30", "10", "40", "20"],
  ["Priority", "4", "2", "1", "3"]
);
console.log("\t\n ROUND-ROBIN SCHEDULING IMPLEMENTATION \n");
console.log(table.toString());

let quantum = 15;
let contextSwitch = 4;
let accumulatedWaitTime = 0;

console.log(`\n* Quantum: ${quantum}u.t\n* Context Switch: ${contextSwitch}u.t.\n`);
console.log("---------------");

// defining tasks and their respective arrival and duration
const tasks = [
  {
    task: "t1",
    arrival: 5,
    duration: 30,
    waitTime: 0,
    turnaroundTime: 0,
    loop: 0,
  },
  {
    task: "t2",
    arrival: 15,
    duration: 10,
    waitTime: 0,
    turnaroundTime: 0,
    loop: 0,
  },
  {
    task: "t3",
    arrival: 10,
    duration: 40,
    waitTime: 0,
    turnaroundTime: 0,
    loop: 0,
  },
  {
    task: "t4",
    arrival: 0,
    duration: 20,
    waitTime: 0,
    turnaroundTime: 0,
    loop: 0,
  },
];

// sorting in ascending order by arrival time
tasks.sort((a, b) => a.arrival - b.arrival);

// execute while there are tasks being executed
while (isExecuting(tasks)) {
  for (let i = 0; i < 4; i++) {
    if (tasks[i].duration > 0) {
      // calculating wait time and turnaround time

      // if it's the last task, there's no need to account for context switch waits. It can execute entirely
      if (isLastTask(i, tasks)) {
        accumulatedWaitTime += tasks[i].duration;

        // turnaround time = accumulatedWaitTime (total wait time + last processing) - arrival
        tasks[i].turnaroundTime = accumulatedWaitTime - tasks[i].arrival;

        // wait time = accumulatedWaitTime - last processing - number of loops (quantum * loop) - arrival
        tasks[i].waitTime =
          accumulatedWaitTime -
          tasks[i].duration -
          tasks[i].loop * quantum -
          tasks[i].arrival;

        tasks[i].duration = 0;
        break;
      }

      // if it's not the last task
      if (tasks[i].duration > quantum) {
        tasks[i].duration -= quantum;
        accumulatedWaitTime += quantum;
        tasks[i].loop++;
      } else {
        // if it's the last burst of the task
        accumulatedWaitTime += tasks[i].duration;

        // turnaround time = accumulatedWaitTime (total wait time + last processing) - arrival
        tasks[i].turnaroundTime = accumulatedWaitTime - tasks[i].arrival;

        // wait time = accumulatedWaitTime - last processing - number of loops - arrival
        tasks[i].waitTime =
          accumulatedWaitTime -
          tasks[i].duration -
          tasks[i].loop * quantum -
          tasks[i].arrival;

        tasks[i].duration = 0;
      }

      accumulatedWaitTime += contextSwitch;
    }
  }
}

// calculate average wait time
const calculateAverageWaitTime = (tasks) => {
  let sumTimes = 0;
  for (let i = 0; i < 4; i++) {
    sumTimes += tasks[i].waitTime;
  }

  const averageWaitTime = sumTimes / 4;
  return averageWaitTime;
};

// calculate average turnaround time
const calculateAverageTurnaroundTime = (tasks) => {
  let sumTurnaroundTimes = 0;
  for (let i = 0; i < 4; i++) {
    sumTurnaroundTimes += tasks[i].turnaroundTime;
  }

  const averageTurnaroundTime = sumTurnaroundTimes / 4;
  return averageTurnaroundTime;
};

const averageWaitTime = calculateAverageWaitTime(tasks);
const averageTurnaroundTime = calculateAverageTurnaroundTime(tasks);
console.log(`\n=> Average Wait Time: ${averageWaitTime.toFixed(1)}`);
console.log(`=> Average Turnaround Time: ${averageTurnaroundTime.toFixed(1)}\n`);

// check if there are tasks to execute
function isExecuting(tasks) {
  return (
    tasks[0].duration > 0 ||
    tasks[1].duration > 0 ||
    tasks[2].duration > 0 ||
    tasks[3].duration > 0
  );
}

// check if it's the last task to be executed
function isLastTask(task, tasks) {
  for (let i = 0; i < 4; i++) {
    if (i !== task && tasks[i].duration) {
      return false;
    }
  }
  return true;
}
