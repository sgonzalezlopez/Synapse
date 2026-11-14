# SYN-004 — Hipótesis y experimentos

## Hipótesis inicial (H1)
En un entorno que favorezca la coordinación, permitir señales heredables y perceptibles puede incrementar un indicador de éxito (por ejemplo supervivencia) frente a una condición sin comunicación.

## Condiciones
- A: señales activadas, con su coste energético.
- B: señales desactivadas, manteniendo las demás reglas.
- C (control opcional): señales aleatorias o desacopladas del emisor para investigar si importa su contenido.

## Procedimiento
1. Fijar reglas del mundo y versión del simulador.
2. Definir antes de ejecutar la métrica principal y la duración.
3. Ejecutar múltiples réplicas por condición con semillas registradas.
4. Comparar métricas entre condiciones y dispersión entre réplicas.
5. Repetir en distintos niveles de recursos, riesgos y coste de señal.

## Métricas
- Principal: supervivencia por agente/generación o productividad energética, predefinida para cada ensayo.
- Secundarias: crecimiento poblacional, número de señales, coste de señalización, frecuencia de reproducción.
- Informacionales: asociación entre señales y contexto, dependencia entre señal recibida y respuesta, persistencia transgeneracional.
- Robustez: estabilidad por semillas, tamaños de población y condiciones ambientales.

## Criterio de indicio de comunicación funcional
No basta con una correlación. Buscaremos mejora reproducible respecto al control, dependencia observable de la recepción y pérdida o reducción del efecto si se perturban las señales.

## Limitaciones
- Asociación no demuestra semántica, intención ni lenguaje.
- Efectos de aprendizaje y evolución pueden confundirse; documentar mecanismos activos.
- La selección de métricas posterior al experimento puede sesgar conclusiones.

## Registro de resultados
Guardar versión, configuración, semilla, condición, duración, métricas y notas; evitar afirmar descubrimientos antes de controles adecuados.