# Registro de decisiones — Synapse

## Aprobadas (2026-11-14)
- D1: mundo 2D continuo toroidal (bordes conectados).
- D2: política de decisión mediante red neuronal pequeña, con pesos heredables.
- D3: reproducción asexual con mutaciones.
- D4: un canal de señal escalar en [-1, 1], sin semántica predefinida.
- D5: riesgos ambientales estáticos durante el MVP.
- D6: concretar la métrica primaria y las réplicas en SYN-004 **antes de ejecutar experimentos**.

## Principios aprobados
- Propósito: laboratorio de comunicación emergente entre agentes, sin atribuir consciencia o lenguaje humano.
- Comparación experimental contra condiciones sin señales y con señales desacopladas.
- Cada ejecución debe poder reproducirse usando versión, semilla y configuración.

## Propuestas arquitectónicas — pendientes de validación de SYN-003
- TypeScript para motor puro y web React para observación.
- Motor determinista y desacoplado de UI.
- Render 2D mediante Canvas; trabajadores Web Worker para evitar bloquear la interfaz.
- Exportación de experimentos JSON/CSV antes de incorporar una base de datos.
- Esquema de observaciones y topología exacta de red neuronal, presupuestos y límites de rendimiento.

## Pendientes para SYN-004 y desarrollo
- Métrica principal, hipótesis operacional definitiva, potencia/numero de réplicas y criterios estadísticos.
- Valores iniciales de energías, costes, mutaciones y densidades.
- Persistencia futura y escalabilidad.

**Nota:** aprobación de D1-D6 no supone aprobación automática de propuestas técnicas pendientes.
