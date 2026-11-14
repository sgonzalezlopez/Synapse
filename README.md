# SYNAPSE — Laboratorio de comunicación emergente

Un laboratorio web de evolución artificial para investigar si pueden surgir señales funcionales **sin imponer significados**. Los resultados observados en una simulación **no son prueba** de que haya aparecido lenguaje.

## Inicio rápido

Requiere Node.js 22+.

```bash
npm install
npm run dev
```

Abre la dirección que muestra Vite. El motor funciona en un Web Worker para mantener la interfaz fluida.

## Funciones del primer prototipo
- Mundo toroidal 2D con alimento agrupado y riesgos estáticos.
- Agentes con redes neuronales pequeñas, energía, edad, reproducción asexual y mutaciones.
- Señales escalares heredables con coste y retardo de un tick.
- Comparaciones exploratorias: `active`, `disabled`, `shuffled`.
- Inspector de criaturas, controles de simulación, visualización y telemetría.
- Exportación JSON de resultados y CSV de métricas recientes.

## Validación
```bash
npm run lint
npm test
npm run build
```

## Advertencias experimentales
Este software es un **prototipo**. Los ensayos confirmatorios de SYN-004 (múltiples semillas, análisis de descendencia viable, congelación de genomas e intervención) aún no están implementados. Los modos de señales son instrumentos exploratorios y no permiten, sin controles adicionales, afirmar comunicación emergente.

## Documentación
- [SYN-001: Visión](docs/01-vision.md)
- [SYN-002: MVP](docs/02-mvp.md)
- [SYN-003: Arquitectura](docs/03-arquitectura.md)
- [SYN-004: Protocolo experimental](docs/04-experimentos.md)
- [Backlog](docs/05-backlog.md)
- [Decisiones](docs/06-decisiones.md)

## Estado
Implementado: prototipo visual de motor evolutivo, señales y métricas. Pendiente: experimento confirmatorio completo y pruebas de significancia estadística.
