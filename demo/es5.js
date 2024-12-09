const fps = 1e3 / 60;
let frameDeadline
let pendingCallback
const channel = new MessageChannel();
let now = 0;
const timeRemaining = () => {
  now = performance.now();
  return frameDeadline - now;
};

const deadline = {
  didTimeout: false,
  timeRemaining,
};

channel.port2.onmessage = () => {
  if (typeof pendingCallback === 'function') {
    pendingCallback(deadline);
  }
};

const rIC = (callback) => {
  return window.requestAnimationFrame((frameTime) => {
    frameDeadline = frameTime + fps;
    pendingCallback = callback;
    channel.port1.postMessage(null);
  });
};

export class Context {
  prev = 0;
  next = 0;
  end = false;
  pendingFrame = null;

  constructor(innerFunc) {
    this.innerFunc = innerFunc
    this.workLoop = this.workLoop.bind(this)
  }

  tick() {
    this.innerFunc(this)
  }

  start() {
    this.pendingFrame = rIC(this.workLoop)
  }

  run(task) {
    task()
  }

  workLoop(deadline) {
    while (!this.end && deadline.timeRemaining() > 1) {
      this.tick();
    }

    if (!this.end) {
      this.pendingFrame = rIC(this.workLoop.bind(this))
    }
  }

  stop() {
    this.end = true;
    if (this.pendingFrame) {
      window.cancelAnimationFrame(this.pendingFrame)
      this.pendingFrame = undefined;
    }
  }
}

function wrap(innerFunc) {
  const ctx = new Context(innerFunc)
  return new Promise(() => {
    ctx.start();
  })
}

const regeneratorRuntime = {
  wrap
}

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
async function program$() {
  return regeneratorRuntime.wrap(function program$$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return _context.run(() => longtask(1));
      case 2:
        _context.next = 4;
        return _context.run(() => longtask(2));
      case 4:
        _context.next = 6;
        return _context.run(() => longtask(3));
      case 6:
        _context.next = 8;
        return _context.run(() => longtask(3));
      case 8:
        _context.next = 10;
        return _context.run(() => longtask(4));
      case 10:
        _context.next = 12;
        return _context.run(() => longtask(5));
      case 12:
        _context.next = 14;
        return _context.run(() => longtask(6));
      case 14:
        _context.next = 16;
        return _context.run(() => longtask(7));
      case 16:
        _context.next = 18;
        return _context.run(() => longtask(8));
      case 18:
        _context.next = 20;
        return _context.run(() => longtask(9));
      case 20:
        _context.next = 22;
        return _context.run(() => longtask(10));
      case 22:
        _context.next = 24;
        return _context.run(() => longtask(11));
      case 24:
        _context.next = 26;
        return _context.run(() => longtask(12));
      case 26:
        _context.next = 28;
        return _context.run(() => longtask(14));
      case 28:
      case "end":
        return _context.stop();
    }
  });
}
program$();
