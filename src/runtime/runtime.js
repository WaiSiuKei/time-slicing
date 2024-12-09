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
