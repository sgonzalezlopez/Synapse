import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, Simulation, validateConfig, type SignalMode } from './engine';

const cfg=(mode:SignalMode='active')=>({...DEFAULT_CONFIG,population:25,foodCount:70,hazardCount:3,signalMode:mode,seed:123});
describe('Simulation',()=>{
  it('reproduces the same run for a seed and configuration',()=>{
    const a=new Simulation(cfg()),b=new Simulation(cfg());
    for(let i=0;i<150;i++){a.step();b.step();}
    expect(a.summary()).toEqual(b.summary());
    expect(a.snapshot()).toEqual(b.snapshot());
  });
  it('keeps positions within the toroidal world and valid energy',()=>{
    const s=new Simulation(cfg());
    for(let i=0;i<150;i++)s.step();
    expect(s.agents.every(a=>a.x>=0&&a.x<100&&a.y>=0&&a.y<100&&a.energy>0)).toBe(true);
    expect(s.agents.length).toBeLessThanOrEqual(s.config.maxPopulation);
  });
  it('supports all three signal control conditions reproducibly',()=>{
    for(const mode of ['active','disabled','shuffled'] as const){
      const s=new Simulation(cfg(mode));
      for(let i=0;i<70;i++)s.step();
      expect(s.summary().config.signalMode).toBe(mode);
      expect(s.tick).toBe(70);
    }
  });
  it('rejects invalid configurations',()=>{
    expect(()=>validateConfig({...DEFAULT_CONFIG,population:-1})).toThrow();
    expect(()=>validateConfig({...DEFAULT_CONFIG,seed:Number.NaN})).toThrow();
  });
  it('never progresses beyond the maximum duration',()=>{
    const s=new Simulation({...cfg(),maxTicks:2});
    for(let i=0;i<20;i++)s.step();
    expect(s.tick).toBe(2);
  });
  it('does not expose mutable genotypes in visual snapshots',()=>{
    const s=new Simulation(cfg());
    expect(s.snapshot().agents[0].genome).toEqual([]);
    expect(s.agents[0].genome.length).toBeGreaterThan(0);
  });
});
