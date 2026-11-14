/**
 * Synapse engine v0.1.0: a deterministic, simplified artificial ecosystem.
 * Signals have no predefined meanings. This is NOT a scientific finding.
 */
export const ENGINE_VERSION = '0.1.0';
export type SignalMode = 'active' | 'disabled' | 'shuffled';

export interface Config {
  schemaVersion: 1;
  seed: number;
  width: number;
  height: number;
  population: number;
  maxPopulation: number;
  maxTicks: number;
  foodCount: number;
  foodEnergy: number;
  hazardCount: number;
  signalMode: SignalMode;
  signalRange: number;
  signalCost: number;
  mutationRate: number;
  basalCost: number;
  moveCost: number;
  reproductionEnergy: number;
}
export interface Agent {
  id: number; parentId: number | null; generation: number;
  x: number; y: number; age: number; energy: number;
  genome: number[]; signal: number;
}
export interface Item { x: number; y: number }
export interface Snapshot {
  tick: number; agents: Agent[]; food: Item[]; hazards: Item[];
  births: number; deaths: number; emissions: number; energyMean: number;
  populationHistory: number[]; signalHistory: number[];
}
export type Summary = {
  engineVersion: string; config: Config; tick: number;
  births: number; deaths: number; survivors: number; emissions: number;
  totalEnergy: number; history: { tick: number; population: number; emissions: number }[];
};
export const DEFAULT_CONFIG: Config = {
  schemaVersion: 1, seed: 42, width: 100, height: 100,
  population: 100, maxPopulation: 350, maxTicks: 10000,
  foodCount: 240, foodEnergy: 22, hazardCount: 8,
  signalMode: 'active', signalRange: 15, signalCost: 0.045,
  mutationRate: 0.08, basalCost: 0.07, moveCost: 0.045, reproductionEnergy: 80
};

export function validateConfig(c: Config): Config {
  if (c.schemaVersion !== 1) throw new Error('Unsupported configuration version');
  const finite = (v: number, min: number, max: number, label: string) => {
    if (!Number.isFinite(v) || v < min || v > max) throw new Error('Invalid ' + label);
  };
  finite(c.seed, 0, 4294967295, 'seed');
  finite(c.width, 20, 2000, 'width'); finite(c.height, 20, 2000, 'height');
  finite(c.population, 1, 2000, 'population'); finite(c.maxPopulation, 1, 5000, 'capacity');
  if (!Number.isInteger(c.population) || !Number.isInteger(c.maxPopulation) || c.population > c.maxPopulation) throw new Error('Invalid population');
  finite(c.maxTicks, 1, 1000000, 'ticks');
  finite(c.foodCount, 0, 10000, 'food'); finite(c.hazardCount, 0, 500, 'hazards');
  finite(c.foodEnergy, 0.01, 10000, 'food energy');
  finite(c.signalRange, 0.01, 1000, 'signal range');
  finite(c.signalCost, 0, 1000, 'signal cost');
  finite(c.mutationRate, 0, 2, 'mutation rate');
  finite(c.basalCost, 0, 1000, 'metabolism');
  finite(c.moveCost, 0, 1000, 'movement');
  finite(c.reproductionEnergy, 1, 10000, 'reproduction');
  if (!['active','disabled','shuffled'].includes(c.signalMode)) throw new Error('Invalid signal mode');
  if (![c.maxTicks,c.foodCount,c.hazardCount].every(Number.isInteger)) throw new Error('Counts must be integers');
  return structuredClone(c);
}

class RNG {
  state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next(): number {
    this.state = (this.state + 0x6D2B79F5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  normal(): number { return (this.next() + this.next() + this.next() + this.next() - 2) * 1.73; }
}
const wrap = (x: number, length: number) => ((x % length) + length) % length;
const delta = (from: number, to: number, size: number) => {
  const d = to - from; return d > size / 2 ? d - size : d < -size / 2 ? d + size : d;
};
const sigmoid = (x: number) => Math.tanh(x);
const INPUTS = 9, HIDDEN = 8, OUTPUTS = 3;
const WEIGHTS = INPUTS * HIDDEN + HIDDEN + HIDDEN * OUTPUTS + OUTPUTS;
function policy(weights: number[], inputs: number[]): number[] {
  const hidden: number[] = []; let offset = 0;
  for (let h=0;h<HIDDEN;h++) {
    let sum=0;
    for (let i=0;i<INPUTS;i++) sum+=weights[offset++] * inputs[i];
    hidden.push(sigmoid(sum + weights[INPUTS * HIDDEN + h]));
  }
  offset = INPUTS * HIDDEN + HIDDEN;
  const result: number[] = [];
  for (let o=0;o<OUTPUTS;o++) {
    let sum=0;
    for (let h=0;h<HIDDEN;h++) sum+=weights[offset++] * hidden[h];
    result.push(sigmoid(sum + weights[INPUTS*HIDDEN+HIDDEN+HIDDEN*OUTPUTS+o]));
  }
  return result;
}
type Intent = { x: number; y: number; signal: number; effort: number };
export class Simulation {
  readonly config: Config;
  readonly worldRng: RNG;
  readonly evolutionRng: RNG;
  readonly shuffleRng: RNG;
  agents: Agent[] = [];
  food: Item[] = [];
  hazards: Item[] = [];
  tick = 0; births = 0; deaths = 0; emissions = 0;
  nextId = 1;
  populationHistory: number[] = [];
  signalHistory: number[] = [];
  history: Summary['history'] = [];
  constructor(config: Config = DEFAULT_CONFIG) {
    this.config = validateConfig(config);
    const s = this.config.seed >>> 0;
    this.worldRng = new RNG(s ^ 0xA5A5A5A5);
    this.evolutionRng = new RNG(s ^ 0x7F4A7C15);
    this.shuffleRng = new RNG(s ^ 0xDEADBEEF);
    for (let i=0;i<this.config.hazardCount;i++) this.hazards.push(this.point());
    for (let i=0;i<this.config.foodCount;i++) this.food.push(this.spawnFood());
    for (let i=0;i<this.config.population;i++) {
      const p=this.point();
      this.agents.push({id:this.nextId++,parentId:null,generation:0,...p,age:0,energy:55,signal:0,genome:this.newGenome()});
    }
    this.record();
  }
  point(): Item {return {x:this.worldRng.next()*this.config.width,y:this.worldRng.next()*this.config.height};}
  spawnFood(): Item {
    // Some food appears in clusters to generate local information gradients.
    if (this.food.length>0 && this.worldRng.next()<0.65) {
      const center=this.food[Math.floor(this.worldRng.next()*this.food.length)];
      return {x:wrap(center.x+this.worldRng.normal()*3,this.config.width),y:wrap(center.y+this.worldRng.normal()*3,this.config.height)};
    }
    return this.point();
  }
  newGenome(): number[] { return Array.from({length:WEIGHTS},()=>this.evolutionRng.normal()*0.7); }
  distance2(a: Item,b: Item): number {
    const dx=delta(a.x,b.x,this.config.width),dy=delta(a.y,b.y,this.config.height);
    return dx*dx+dy*dy;
  }
  observation(a: Agent, signals: number[]): number[] {
    let nearestFood: Item | undefined;let foodDist=Infinity;
    for(const item of this.food) {const d=this.distance2(a,item);if(d<foodDist){foodDist=d;nearestFood=item;}}
    let nearestRisk: Item | undefined;let riskDist=Infinity;
    for(const item of this.hazards) {const d=this.distance2(a,item);if(d<riskDist){riskDist=d;nearestRisk=item;}}
    const fd=nearestFood && foodDist<=625?Math.sqrt(foodDist):Infinity;
    const rd=nearestRisk && riskDist<=400?Math.sqrt(riskDist):Infinity;
    const foodX=nearestFood && Number.isFinite(fd)?delta(a.x,nearestFood.x,this.config.width)/25:0;
    const foodY=nearestFood && Number.isFinite(fd)?delta(a.y,nearestFood.y,this.config.height)/25:0;
    const riskX=nearestRisk && Number.isFinite(rd)?delta(a.x,nearestRisk.x,this.config.width)/20:0;
    const riskY=nearestRisk && Number.isFinite(rd)?delta(a.y,nearestRisk.y,this.config.height)/20:0;
    let count=0;
    for(const other of this.agents) if(other.id!==a.id && this.distance2(a,other)<100) count++;
    const perceived=signals.reduce((v,s)=>v+s,0);
    return [foodX,foodY,riskX,riskY,Math.min(count/10,1),Math.min(a.energy/100,1),Math.tanh(perceived),Number.isFinite(fd)?1-fd/25:0,Number.isFinite(rd)?1-rd/20:0];
  }
  step(): Snapshot {
    if(this.tick>=this.config.maxTicks || this.agents.length===0) return this.snapshot();
    const previous=this.agents.map(a=>({...a}));
    const incoming: number[][]=previous.map(()=>[]);
    // All signals are read from the previous tick, never from new emissions.
    for(let j=0;j<previous.length;j++) for(let i=0;i<previous.length;i++) {
      if(i===j)continue;
      const d=Math.sqrt(this.distance2(previous[j],previous[i]));
      if(d<=this.config.signalRange) incoming[j].push(previous[i].signal*(1-d/this.config.signalRange));
    }
    if(this.config.signalMode==='disabled') for(const list of incoming)list.length=0;
    if(this.config.signalMode==='shuffled') {
      const flat=incoming.flat();
      for(let i=flat.length-1;i>0;i--){const j=Math.floor(this.shuffleRng.next()*(i+1));[flat[i],flat[j]]=[flat[j],flat[i]];}
      let k=0; for(let i=0;i<incoming.length;i++) for(let j=0;j<incoming[i].length;j++)incoming[i][j]=flat[k++];
    }
    const intents: Intent[]=previous.map((a,i)=>{
      const [vx,vy,signal]=policy(a.genome,this.observation(a,incoming[i]));
      const effort=Math.min(1,Math.hypot(vx,vy));
      const norm=Math.max(1,Math.hypot(vx,vy));
      return {x:vx/norm,y:vy/norm,signal,effort};
    });
    let signalCount=0;
    for(let i=0;i<this.agents.length;i++){
      const a=this.agents[i],intent=intents[i];
      a.x=wrap(a.x+intent.x*1.2,this.config.width);
      a.y=wrap(a.y+intent.y*1.2,this.config.height);
      a.energy-=this.config.basalCost+intent.effort*this.config.moveCost+Math.abs(intent.signal)*this.config.signalCost;
      a.signal=intent.signal;
      a.age++;
      if(Math.abs(intent.signal)>0.1)signalCount++;
    }
    // Rotate deterministic random priorities to avoid agent-array advantage on food contention.
    const order=this.agents.map((_,i)=>i);
    for(let i=order.length-1;i>0;i--){const j=Math.floor(this.worldRng.next()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    const eaten=new Set<number>();
    for(const index of order){
      const a=this.agents[index];
      let nearest=-1;let best=2.25;
      for(let k=0;k<this.food.length;k++){
        if(eaten.has(k))continue;
        const d=this.distance2(a,this.food[k]);
        if(d<best){best=d;nearest=k;}
      }
      if(nearest>=0){eaten.add(nearest);a.energy+=this.config.foodEnergy;}
    }
    this.food=this.food.filter((_,i)=>!eaten.has(i));
    const survivors: Agent[]=[];
    const newborns: Agent[]=[];
    for(const a of this.agents){
      let risk=0;
      for(const h of this.hazards) if(this.distance2(a,h)<9){risk=0.45;break;}
      a.energy-=risk;
      if(a.energy<=0 || a.age>=1200){this.deaths++;continue;}
      if(a.energy>=this.config.reproductionEnergy && survivors.length+newborns.length<this.config.maxPopulation){
        a.energy*=0.5;
        const genome=a.genome.map(v=>this.evolutionRng.next()<0.18?v+this.evolutionRng.normal()*this.config.mutationRate:v);
        newborns.push({id:this.nextId++,parentId:a.id,generation:a.generation+1,x:wrap(a.x+this.evolutionRng.normal(),this.config.width),y:wrap(a.y+this.evolutionRng.normal(),this.config.height),age:0,energy:a.energy,signal:0,genome});
        this.births++;
      }
      survivors.push(a);
    }
    this.agents=survivors.concat(newborns).slice(0,this.config.maxPopulation);
    while(this.food.length<this.config.foodCount && this.worldRng.next()<0.75){
      this.food.push(this.spawnFood());
    }
    this.tick++;
    this.emissions+=signalCount;
    this.record(signalCount);
    return this.snapshot();
  }
  record(signals=0): void {
    this.populationHistory.push(this.agents.length);
    this.signalHistory.push(signals);
    if(this.populationHistory.length>240){this.populationHistory.shift();this.signalHistory.shift();}
    if(this.tick%25===0)this.history.push({tick:this.tick,population:this.agents.length,emissions:this.emissions});
  }
  snapshot(): Snapshot {
    const energyMean=this.agents.length?this.agents.reduce((s,a)=>s+a.energy,0)/this.agents.length:0;
    return {tick:this.tick,agents:this.agents.map(a=>({...a,genome:[]})),food:this.food.map(x=>({...x})),hazards:this.hazards.map(x=>({...x})),births:this.births,deaths:this.deaths,emissions:this.emissions,energyMean,populationHistory:[...this.populationHistory],signalHistory:[...this.signalHistory]};
  }
  summary(): Summary {
    return {engineVersion:ENGINE_VERSION,config:this.config,tick:this.tick,births:this.births,deaths:this.deaths,survivors:this.agents.length,emissions:this.emissions,totalEnergy:this.agents.reduce((s,a)=>s+a.energy,0),history:this.history.map(x=>({...x}))};
  }
}
