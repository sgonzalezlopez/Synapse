# Decisiones de Synapse

## Aprobadas — 14 de noviembre de 2026
- D1: mundo continuo toroidal.
- D2: pequeña red neuronal de pesos heredables.
- D3: reproducción asexual con mutaciones.
- D4: señal escalar [-1,1], sin semántica impuesta.
- D5: riesgos estáticos en el MVP.
- D6: protocolo experimental previo a las conclusiones.
- A: Vite + React + TypeScript; motor puro, Canvas 2D y Web Worker.
- B: selección y mutación sin aprendizaje individual en el MVP.
- C: las señales de un tick afectan a las observaciones del siguiente.
- D: exportación JSON/CSV sin base de datos inicial.
- E: PRNG determinista con flujos separados y esquemas versionados.

## Convenciones de implementación
- Empezar con un motor TypeScript ejecutable sin navegador.
- Mantener controles de comunicación `active`, `disabled` y `shuffled` sin etiquetas semánticas.
- Visualización y ritmo de fotogramas separados de los ticks.
- Medir supervivencia, reproducción y señales; distinguir claramente métricas exploratorias de confirmatorias.

## Pendientes de revisión tras el MVP
- Valores numéricos de metabolismo, alimentación, reproducción y mutación.
- Ajustes de topología neuronal y sensibilidad de observaciones.
- Mejorar diseño de experimentos de perturbación con genomas congelados.
- Ejecutar un piloto y luego un ensayo confirmatorio preregistrado.
