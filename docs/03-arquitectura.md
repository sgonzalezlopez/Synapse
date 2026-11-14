# SYN-003 — Arquitectura propuesta

## Enfoque
Web-first con motor de simulación independiente de la interfaz. Stack provisional: TypeScript, React y Canvas/WebGL según necesidades de rendimiento. No se fija framework ni base de datos hasta validar requisitos.

## Módulos
### Core
Mundo, tick discreto, generador pseudoaleatorio con semilla, recursos, riesgos, colisiones, reproducción y muerte.

### Agent policy
Observaciones locales -> elección de acciones. Genotipo/parámetros heredables y mutación. Separado del motor para permitir sustituir la política.

### Signals
Emisión, alcance, propagación simplificada, coste y percepción. El canal es independiente de la lógica del agente y puede desactivarse como control.

### Experiments
Configuración versionada, condiciones comparativas, replicaciones con diferentes semillas, captura de métricas.

### Analytics
Eventos de emisión/recepción, contexto, conducta posterior, genealogías y estadísticas. Evitar retener todos los fotogramas en memoria.

### UI
Renderizado 2D, inspección de agentes y linajes, controles de simulación y panel de métricas.

## Interfaces iniciales
- SimulationConfig: seed, world, agents, food, hazards, signals, mutation, duration.
- SimulationState: tick, entities, resources, stats.
- SimulationEvent: tick, agentId, type, payload.
- ExperimentResult: config, version, seed, summaryMetrics.

## Requisitos no funcionales
- Reproducibilidad de resultados.
- Motor con pruebas automatizadas, independiente del navegador.
- Rendimiento medible antes de optimización.
- Configuraciones y métricas exportables.
- La interfaz no modifica la física del motor.