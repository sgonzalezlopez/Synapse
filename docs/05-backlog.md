# Backlog — Synapse

Actualización: 14 de noviembre de 2026. El estado **implementado** significa que existe código en main con CI superada; no significa que exista evidencia científica.

## Fase 0 — Documentación
- [x] SYN-001 — Visión y límites del producto.
- [x] SYN-002 — MVP especificado; D1–D6 aprobadas.
- [x] SYN-003 — Arquitectura aprobada y documentada.
- [x] SYN-004 — Protocolo preregistrado v1 (sin ensayos confirmatorios ejecutados).

## Fase 1 — Motor del primer prototipo
- [x] SYN-005 — Proyecto Vite + React + TypeScript, Vitest y CI.
- [x] SYN-006 — Mundo toroidal 2D, ticks y semillas.
- [x] SYN-007 — Agentes con energía, redes neuronales, sensores y movimiento.
- [x] SYN-008 — Alimento agrupado, riesgos ambientales estáticos y ciclo vital.
- [x] SYN-009 — Reproducción asexual, herencia de pesos y mutación.
- [x] SYN-010 — Señal escalar de un tick de retraso, atenuación, coste y tres controles exploratorios.

## Fase 2 — Observabilidad del prototipo
- [x] SYN-011 — Interfaz Canvas y controles de simulación.
- [x] SYN-012 — Telemetría de población y cantidad de señales.
- [x] SYN-013 — Inspección individual básica con filiación de progenitor (árbol genealógico completo, pendiente).
- [x] SYN-014 — Exportación de resúmenes JSON y CSV de métricas recientes.

## Fase 3 — Validación experimental (pendiente)
- [ ] SYN-015 — Runner de réplicas, métrica primaria preregistrada de descendientes viables, resultados íntegros y comparaciones entre condiciones.
- [ ] SYN-016 — Análisis estadístico con intervalos bootstrap y estudios de perturbación con genomas congelados.
- [ ] SYN-017 — Informe de hallazgos reproducibles, límites y recomendaciones de nuevos ensayos.

## Deuda técnica identificada
- [ ] Añadir pruebas end-to-end de interacción del navegador y pruebas de rendimiento en ejecuciones largas.
- [ ] Exportar historia completa de eventos y todos los ticks si el experimento lo requiere, en formato eficiente.
- [ ] Reemplazar búsqueda ingenua de vecinos por índice espacial si las mediciones lo justifican.
- [ ] Ampliar controles de neutralización de costes e información en condiciones disabled/shuffled.
- [ ] Parametrizar y validar completamente topología y sensores de la red neuronal.
- [ ] Hacer explícito en interfaz el criterio de paradas tempranas por extinción.
- [ ] Revisar riesgos de sesgo reproductivo debidos al orden de resolución de agentes.

## Condición de cierre del programa
Se considerará **MVP funcional** cuando el software se ejecute y las pruebas de CI pasen. Solo se considerará **ensayo científico completo** cuando SYN-015, SYN-016 y SYN-017 tengan resultados reproducibles y una revisión rigurosa. No afirmar emergencia del lenguaje sin esas pruebas.
