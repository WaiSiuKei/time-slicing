let taskCount = 0;

function longtask() {
  console.time(taskCount.toString());
  let sum = 0;
  while (sum < 5e5) {
    sum += Math.random();
  }
  console.timeEnd(taskCount.toString());
  taskCount++;
}

async function program() {
  longtask(1);
  longtask(2);
  longtask(3);
  longtask(3);
  longtask(4);
  longtask(5);
  longtask(6);
  longtask(7);
  longtask(8);
  longtask(9);
  longtask(10);
  longtask(11);
  longtask(12);
  longtask(14);
}

program$()

