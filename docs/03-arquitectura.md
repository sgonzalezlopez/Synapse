# SYN-003 — Arquitectura aprobada

## Stack
TypeScript + React + Vite; Canvas 2D; Web Worker para la simulación; Vitest para pruebas; JSON/CSV para exportación.

## Capas
- `src/engine.ts`: lógica determinista, RNG, mundo toroidal, recursos, peligros, redes neuronales, señales de retardo 1 tick, acciones y mutación.
- `src/worker.ts`: aislamiento de simulación respecto de la UI; comandos start/pause/step/reset/speed.
- `src/App.tsx`: interfaz de laboratorio, controles, panel de métricas e inspector.
- `src/main.tsx`: arranque React.
- `src/engine.test.ts`: determinismo, límites de estado, modos de señales, reproducción y energía.

## Contratos
`Config`: versión, seed, población, tamaño, duración, metabolismo, alimentos, riesgos y modo del canal.
`Simulation`: tick, agentes, comida, estado del PRNG y métricas.
`Agent`: id, parentId, generación, energía, posición, edad, genoma y última señal.
`Snapshot`: estado de visualización y métricas. Los snapshots son desacoplados del número de ticks.
`RunSummary`: configuración, versión, semilla, modo, ticks, reproducciones, muertes, señalizaciones, supervivientes.

## Garantías
Misma semilla/configuración/versión produce la misma ejecución, sin utilizar Math.random ni Date dentro del motor. El render no puede alterar el motor. Las acciones se calculan a partir de un snapshot anterior por tick. Los receptores reciben señales del tick anterior. Los desempates siguen el PRNG.

## Límites
Motor experimental, no modelo biológico ni lingüístico fiel. Comparar ejecuciones requiere réplicas; no se infiere comunicación solo por patrones visuales.

## Validación
`npm test`, `npm run build`, `npm run lint`. CI valida los tres. SYN-004 define experimentos. Cada cambio de reglas implica versión/commit nuevo al recopilar datos.
