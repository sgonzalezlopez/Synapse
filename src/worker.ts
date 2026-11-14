/// <reference lib="webworker" />
import { DEFAULT_CONFIG, Simulation, type Config, type SignalMode } from './engine';

type Command =
  | { type: 'initialize'; config: Config }
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'step'; count?: number }
  | { type: 'speed'; value: number }
  | { type: 'export' };

let sim = new Simulation(DEFAULT_CONFIG);
let running = false;
let speed = 1;
const send = (type: string, data: unknown) => self.postMessage({ type, data });
const snapshot = () => send('snapshot', sim.snapshot());
const update = () => {
  if (!running) return;
  for (let i=0;i<speed;i++) {
    if (sim.tick>=sim.config.maxTicks || sim.agents.length===0) {
      running=false;
      send('completed',sim.summary());
      break;
    }
    sim.step();
  }
  snapshot();
};
setInterval(update, 80);
self.onmessage = (event: MessageEvent<Command>) => {
  try {
    const msg = event.data;
    switch (msg.type) {
      case 'initialize':
        running=false; sim=new Simulation(msg.config); snapshot(); break;
      case 'start':
        running=true; send('running',true); break;
      case 'pause':
        running=false; send('running',false); snapshot(); break;
      case 'step':
        running=false;for(let i=0;i<Math.max(1,Math.min(1000,msg.count??1));i++)sim.step();
        send('running',false);snapshot();break;
      case 'speed':
        speed=Math.max(1,Math.min(200,Math.floor(msg.value)));break;
      case 'export':
        send('export',sim.summary());break;
    }
  } catch(e) {
    running=false;
    send('error',e instanceof Error?e.message:String(e));
  }
};
// Keep types referenced for explicit worker contract documentation.
export type WorkerConfig=Config;
export type WorkerSignalMode=SignalMode;
snapshot();
