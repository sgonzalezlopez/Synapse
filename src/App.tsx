import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, ArrowDownToLine, Dna, FlaskConical, Pause, Play, RotateCcw, Settings2, Signal, SkipForward, Waves } from 'lucide-react';
import { DEFAULT_CONFIG, type Agent, type Config, type Snapshot, type Summary, type SignalMode } from './engine';

function download(name: string, content: string, type: string) {
  const file = new Blob([content],{type});
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w=220,h=54;
  const max=Math.max(1,...values),min=Math.min(0,...values);
  const range=Math.max(1,max-min);
  const points=values.map((v,i)=>((i/Math.max(1,values.length-1))*w).toFixed(1)+','+(h-4-((v-min)/range)*(h-10)).toFixed(1)).join(' ');
  return <svg className="spark" viewBox="0 0 220 54" preserveAspectRatio="none" aria-label="Evolución temporal"><polyline points={points} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round"/></svg>;
}
function WorldCanvas({snap, selected, onSelect, showSignals}: {snap: Snapshot|null;selected:number|null;onSelect:(id:number|null)=>void;showSignals:boolean}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current; const context=canvas?.getContext('2d');if(!canvas||!context||!snap)return;
    const width=canvas.width,height=canvas.height;
    context.clearRect(0,0,width,height);
    context.fillStyle='#0b1425';context.fillRect(0,0,width,height);
    const sx=width/100,sy=height/100;
    context.strokeStyle='#192a3f';context.lineWidth=1;
    for(let x=0;x<=100;x+=10){context.beginPath();context.moveTo(x*sx,0);context.lineTo(x*sx,height);context.stroke();}
    for(let y=0;y<=100;y+=10){context.beginPath();context.moveTo(0,y*sy);context.lineTo(width,y*sy);context.stroke();}
    for(const hazard of snap.hazards){
      const x=hazard.x*sx,y=hazard.y*sy;
      const glow=context.createRadialGradient(x,y,0,x,y,18*sx);
      glow.addColorStop(0,'rgba(249,106,103,.24)');glow.addColorStop(1,'rgba(249,106,103,0)');
      context.fillStyle=glow;context.beginPath();context.arc(x,y,18*sx,0,Math.PI*2);context.fill();
      context.fillStyle='#f77878';context.beginPath();context.arc(x,y,3,0,Math.PI*2);context.fill();
    }
    context.fillStyle='#66d7a4';
    for(const food of snap.food){context.beginPath();context.arc(food.x*sx,food.y*sy,1.7,0,Math.PI*2);context.fill();}
    if(showSignals)for(const a of snap.agents)if(Math.abs(a.signal)>.45){
      context.strokeStyle=a.signal>0?'rgba(116,164,255,.16)':'rgba(236,151,238,.16)';
      context.beginPath();context.arc(a.x*sx,a.y*sy,15*sx,0,Math.PI*2);context.stroke();
    }
    for(const a of snap.agents){
      const active=a.id===selected;
      context.fillStyle=active?'#ffdf7d':a.generation>=2?'#d7abff':'#91b6ff';
      context.beginPath();context.arc(a.x*sx,a.y*sy,active?5.3:2.8,0,Math.PI*2);context.fill();
      if(active){context.strokeStyle='#ffe6a3';context.lineWidth=1.8;context.beginPath();context.arc(a.x*sx,a.y*sy,10,0,Math.PI*2);context.stroke();}
    }
  },[snap,selected,showSignals]);
  const click=(e:React.MouseEvent<HTMLCanvasElement>)=>{
    if(!snap)return;
    const rect=e.currentTarget.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*100,y=(e.clientY-rect.top)/rect.height*100;
    let best:Agent|null=null,bestDist=4;
    for(const a of snap.agents){const d=Math.hypot((a.x-x),(a.y-y));if(d<bestDist){best=a;bestDist=d;}}
    onSelect(best?.id??null);
  };
  return <canvas ref={ref} onClick={click} width={900} height={610} aria-label="Mapa de simulación, selecciona una criatura" role="img"/>;
}
export default function App(){
  const worker=useRef<Worker|null>(null);
  const [config,setConfig]=useState<Config>(DEFAULT_CONFIG);
  const [snap,setSnap]=useState<Snapshot|null>(null);
  const [running,setRunning]=useState(false);
  const [speed,setSpeed]=useState(5);
  const [selected,setSelected]=useState<number|null>(null);
  const [showSignals,setShowSignals]=useState(true);
  const [error,setError]=useState('');
  const [tab,setTab]=useState<'inspector'|'experiment'>('inspector');
  const [complete,setComplete]=useState(false);
  useEffect(()=>{
    const w=new Worker(new URL('./worker.ts',import.meta.url),{type:'module'});
    worker.current=w;
    w.onmessage=(e:MessageEvent<{type:string;data:Snapshot|Summary|string|boolean}>)=>{
      const {type,data}=e.data;
      if(type==='snapshot')setSnap(data as Snapshot);
      else if(type==='running')setRunning(data as boolean);
      else if(type==='completed'){setRunning(false);setComplete(true);}
      else if(type==='export')download('synapse-run-'+Date.now()+'.json',JSON.stringify(data,null,2),'application/json');
      else if(type==='error'){setRunning(false);setError(String(data));}
    };
    w.postMessage({type:'speed',value:speed});
    return ()=>{w.terminate();worker.current=null;};
  },[]);
  const send=useCallback((type:string,extra:Record<string,unknown>={})=>worker.current?.postMessage({type,...extra}),[]);
  const reset=()=>{send('initialize',{config});send('speed',{value:speed});setRunning(false);setComplete(false);setSelected(null);setError('');};
  const update=(key:keyof Config,value:number|string)=>setConfig(old=>({...old,[key]:value}));
  const agent=snap?.agents.find(a=>a.id===selected);
  const total=snap?.agents.length??config.population;
  const sendCsv=()=>{
    if(!snap)return;
    const rows=['index,population,signals',...snap.populationHistory.map((v,i)=>[i,v,snap.signalHistory[i]].join(','))];
    download('synapse-recent-metrics.csv',rows.join('\n'),'text/csv');
  };
  return <main className="app">
    <header className="topbar"><div className="brand"><span className="brandMark"><Dna size={23}/></span><div><strong>SYNAPSE</strong><small>LABORATORIO DE VIDA ARTIFICIAL</small></div></div><div className="topStatus"><span className={'dot '+(running?'live':'')}/>{running?'SIMULACIÓN ACTIVA':'EN PAUSA'} <span className="version">ENGINE v0.1</span></div></header>
    <section className="heading"><div><p className="eyebrow">EXPERIMENTO 001 · COMUNICACIÓN EMERGENTE</p><h1>La vida encuentra<br/><em>su propio lenguaje.</em></h1><p className="subtitle">Un ecosistema evolutivo. Sin palabras programadas. Observa las señales que aparecen cuando las criaturas intentan sobrevivir.</p></div><div className="headingArt"><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/><span>EVOLUTION<br/>IN PROGRESS</span></div></section>
    {error&&<div className="alert" role="alert">{error}</div>}
    <section className="metrics">
      <div className="metric"><span>POBLACIÓN ACTUAL</span><strong>{total}</strong><div className="mini"><Activity size={14}/> {snap?.births??0} nacimientos</div></div>
      <div className="metric"><span>GENERACIONES</span><strong>{Math.max(0,...(snap?.agents.map(a=>a.generation)??[0]))}</strong><div className="mini"><Dna size={14}/> Máxima observada</div></div>
      <div className="metric"><span>SEÑALES EMITIDAS</span><strong>{(snap?.emissions??0).toLocaleString('es-ES')}</strong><div className="mini"><Signal size={14}/> Acumuladas</div></div>
      <div className="metric"><span>TIEMPO SIMULADO</span><strong>{(snap?.tick??0).toLocaleString('es-ES')}</strong><div className="mini"><Waves size={14}/> / {config.maxTicks.toLocaleString('es-ES')} ticks</div></div>
    </section>
    <section className="workspace">
      <div className="worldPanel"><div className="sectionhead"><div><span className="eyebrow">VISTA DEL ECOSISTEMA</span><h2>Mundo Synapse</h2></div><label className="check"><input type="checkbox" checked={showSignals} onChange={e=>setShowSignals(e.target.checked)}/> Mostrar señales</label></div>
        <div className="canvasWrap"><WorldCanvas snap={snap} selected={selected} onSelect={setSelected} showSignals={showSignals}/><span className="mapNote">WORLD 100 × 100 · TOROIDAL</span></div>
        <div className="legend"><span><i className="legendDot blue"/> Criaturas</span><span><i className="legendDot purple"/> Descendientes</span><span><i className="legendDot green"/> Alimento</span><span><i className="legendDot red"/> Peligro</span></div>
        <div className="toolbar"><button className="primary" onClick={()=>{send(running?'pause':'start');setRunning(!running);}}>{running?<Pause size={17}/>:<Play size={17}/>} {running?'Pausar':'Iniciar'}</button><button onClick={()=>{send('step');setRunning(false);}}><SkipForward size={17}/> Paso</button><button onClick={reset}><RotateCcw size={17}/> Reiniciar</button><div className="speed"><label htmlFor="speed">Velocidad</label><select id="speed" value={speed} onChange={e=>{const v=Number(e.target.value);setSpeed(v);send('speed',{value:v});}}><option value={1}>1×</option><option value={5}>5×</option><option value={25}>25×</option><option value={100}>100×</option></select></div></div>
        {complete&&<p className="notice">La ejecución ha finalizado. Exporta los resultados o reinicia con otros parámetros.</p>}
      </div>
      <aside className="side">
        <div className="sideTabs"><button className={tab==='inspector'?'on':''} onClick={()=>setTab('inspector')}>Inspector</button><button className={tab==='experiment'?'on':''} onClick={()=>setTab('experiment')}>Experimento</button></div>
        {tab==='inspector'?<div className="inner">{agent?<><div className="sideIcon"><Dna size={22}/></div><h3>Criatura #{agent.id}</h3><p className="muted">Seleccionada en el mapa</p><div className="details"><div><span>Energía</span><b>{agent.energy.toFixed(1)}</b></div><div><span>Edad</span><b>{agent.age} ticks</b></div><div><span>Generación</span><b>{agent.generation}</b></div><div><span>Progenitor</span><b>{agent.parentId??'Fundadora'}</b></div><div><span>Señal emitida</span><b>{agent.signal.toFixed(3)}</b></div></div></>:<div className="empty"><div className="sideIcon"><Activity size={23}/></div><h3>Explora una criatura</h3><p>Selecciona cualquier punto del mapa para inspeccionar su energía, linaje y última señal.</p></div>}</div>:<div className="inner"><div className="sideIcon"><FlaskConical size={22}/></div><h3>Parámetros</h3><p className="muted">Los cambios se aplican al reiniciar la simulación.</p><label className="field">Modo de señales<select value={config.signalMode} onChange={e=>update('signalMode',e.target.value as SignalMode)}><option value="active">Señales reales</option><option value="disabled">Sin recepción</option><option value="shuffled">Señales alteradas</option></select></label><label className="field">Semilla<input type="number" min="0" max="4294967295" value={config.seed} onChange={e=>update('seed',Math.max(0,Number(e.target.value)))}/></label><label className="field">Población inicial<input type="number" min="1" max="350" value={config.population} onChange={e=>update('population',Math.max(1,Math.min(350,Number(e.target.value))))}/></label><label className="field">Intensidad de mutación<input type="number" min="0" max="2" step="0.01" value={config.mutationRate} onChange={e=>update('mutationRate',Number(e.target.value))}/></label><button className="full" onClick={reset}><Settings2 size={16}/> Aplicar y reiniciar</button></div>}
        <div className="sideExport"><button onClick={()=>send('export')}><ArrowDownToLine size={16}/> Exportar experimento JSON</button><button onClick={sendCsv}><ArrowDownToLine size={16}/> Exportar métricas CSV</button></div>
      </aside>
    </section>
    <section className="bottom"><div className="chartPanel"><div className="sectionhead"><div><span className="eyebrow">TELEMETRÍA</span><h2>Evolución de población</h2></div><span className="muted">Últimos 240 ticks</span></div><Sparkline values={snap?.populationHistory??[100]} color="#9bb9ff"/><div className="chartFoot"><span>Supervivientes: <b>{total}</b></span><span>Muertes: <b>{snap?.deaths??0}</b></span></div></div><div className="chartPanel"><div className="sectionhead"><div><span className="eyebrow">ACTIVIDAD SOCIAL</span><h2>Actividad de señales</h2></div><span className="muted">Por tick</span></div><Sparkline values={snap?.signalHistory??[0]} color="#b79af4"/><p className="note">Las señales no tienen un significado predefinido. Su actividad no demuestra que haya surgido comunicación.</p></div></section>
    <footer><span>SYNAPSE LAB · PROTOTIPO EXPERIMENTAL</span><span>La emergencia de comunicación requiere controles y replicación científica.</span></footer>
  </main>;
}
