# SYN-002 — MVP funcional

## Objetivo
Construir una primera simulación reproducible donde se pueda estudiar la utilidad de una señal simple.

## Entorno
- Mundo bidimensional con límites definidos.
- Recursos energéticos que aparecen según parámetros configurables.
- Riesgos ambientales o depredadores con comportamiento simple.
- Población inicial configurable (objetivo de diseño: 50–200 agentes).
- Tiempo discreto, simulación pausable y acelerable.

## Agentes
- Posición, energía, edad, parámetros heredables y linaje.
- Percepción local y parcial: recursos, riesgos, otros agentes y señales.
- Acciones: desplazarse, consumir recursos, emitir señales y reproducirse bajo condiciones de energía.
- Política de decisión inicialmente sencilla y evolutiva; no requiere LLM.
- Mutación configurable; semilla de generación aleatoria.

## Comunicación
- Una señal escalar continua con alcance limitado y coste energético.
- Los receptores no reciben el significado de la señal.
- El emisor decide cuándo y cuánto emitir; el receptor decide cómo reaccionar.
- Control experimental con canal de señales deshabilitado.

## Visualización
- Mapa 2D en tiempo real con agentes, comida y riesgos.
- Indicador de señales emitidas, selección e inspección de agentes.
- Controles: iniciar, pausar, reiniciar, velocidad, semilla y parámetros.
- Gráficas: población, supervivencia, energía y frecuencia de señales.

## Entregables
1. Motor determinista dado el mismo estado, semilla y versión.
2. Ejecución con señales activadas/desactivadas.
3. Exportación de configuración y resultados.
4. Primer protocolo de evaluación comparativa.

## No objetivos
- Declarar que apareció lenguaje a partir de una animación.
- Aprendizaje profundo distribuido ni simulación masiva en el MVP.