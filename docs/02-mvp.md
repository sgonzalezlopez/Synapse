# SYN-002 — Especificación funcional del MVP (propuesta v0.2)

> Estado: **propuesta para validación**. Los parámetros son valores iniciales de diseño, no hechos científicos demostrados ni decisiones definitivas.

## 1. Propósito y pregunta experimental
Implementar una simulación bidimensional reproducible para investigar si agentes con sensores limitados pueden desarrollar **señales funcionales** sin asignar significados predefinidos a sus emisiones. El MVP no busca lenguaje natural ni conciencia.

**Hipótesis operativa:** bajo condiciones donde informar a otros puede mejorar resultados colectivos, una población con un canal de señales evolutivo podría superar controles comparables sin información útil.

## 2. Modelo temporal y reproducibilidad
- Simulación de pasos discretos (ticks), sin dependencia del reloj de la interfaz.
- Cada ejecución registra semilla, versión del motor, parámetros y condición experimental.
- Orden fijo por tick: (1) generar observaciones del estado anterior, (2) calcular decisiones, (3) resolver costes y movimientos simultáneamente, (4) alimentación y riesgos, (5) reproducción/muerte, (6) recursos, (7) eventos y métricas.
- Resolver conflictos con reglas deterministas y desempate pseudoaleatorio generado por semilla; evitar sesgos por orden de ID.
- Se pueden pausar, acelerar y reiniciar ejecuciones, pero la velocidad gráfica no debe afectar al resultado.

## 3. Mundo
| Parámetro | Propuesta inicial | Configurable |
|---|---|---|
| Geometría | 2D continuo, mundo toroidal para evitar efecto borde | Sí |
| Tamaño | 100 × 100 unidades | Sí |
| Agentes iniciales | 100, con máximo configurable | Sí |
| Fuentes alimenticias | Aparición estocástica con semilla, distribución espacial desigual | Sí |
| Riesgos | Zonas de peligro localizadas, inicialmente estáticas | Sí |
| Duración | 10 000 ticks o condición de parada | Sí |
| Visibilidad | Alcance local, no hay mapa global | Sí |

**Decisión de diseño propuesta:** recursos agrupados y riesgos localizados; una distribución totalmente homogénea podría no ofrecer presión para coordinarse. Predefinir un entorno favorable no garantiza comunicación, por lo que se probarán también ambientes neutrales.

## 4. Agentes y ciclo vital
Cada agente tiene identificador, posición, dirección, energía, edad, genotipo/política, ID de progenitor(es), generación y estado vivo.

- **Percepción:** señales recibidas dentro de alcance; información local aproximada sobre alimento, riesgo y densidad de vecinos; energía propia. No recibe la categoría semántica de una señal.
- **Acciones:** permanecer, orientar/moverse, alimentarse cuando esté al alcance, emitir señal y reproducirse si cumple umbral energético.
- **Costes:** metabolismo basal, movimiento y señalización. Se recompensa el consumo con energía; morir por agotamiento, edad o riesgo.
- **Herencia:** parámetros de la política y sensores son heredables con pequeñas mutaciones. Reproducción asexual en el MVP para simplificar las genealogías.
- **Límites:** edad máxima y capacidad ambiental para prevenir crecimiento ilimitado.
- **Sin roles preprogramados:** no existen exploradores, centinelas ni significados de alarma codificados.

### Política conductual
Una política compacta común en estructura, con pesos heredables diferentes entre agentes, convierte observaciones normalizadas en acciones. Puede implementarse con red neuronal pequeña o reglas numéricas parametrizadas; **la elección permanece pendiente de validación**. No usar LLM ni entrenamiento externo durante el MVP.

## 5. Canal de comunicación
- Un escalar emitido en el intervalo [-1, 1]; 0 equivale a silencio.
- Propagación local dentro de un radio configurable, con atenuación por distancia.
- Cada receptor recibe una agregación de señales detectadas (por ejemplo intensidad agregada y dirección aproximada), no un mensaje etiquetado.
- Emitir tiene coste energético proporcional a intensidad; escuchar puede ser gratuito inicialmente.
- Se registran emisor, receptor(es), valor, posición/contexto y acción posterior.
- No se asigna significado a valores específicos. No existe una regla de tipo «valor positivo = peligro».

**Punto crítico:** las observaciones no pueden filtrar información global ni conocimiento del futuro; de lo contrario las comparaciones quedarían invalidadas.

## 6. Condiciones experimentales
1. **Señal activa:** el emisor controla la señal y los receptores pueden percibirla.
2. **Sin canal:** emisión y recepción deshabilitadas; registrar la diferencia en costes energéticos para no confundir ahorro con efecto de comunicación.
3. **Señal desacoplada:** los receptores reciben una señal aleatorizada con intensidad/coste comparables, destruyendo información contextual.

Comparar poblaciones de evolución independiente, usando conjuntos de semillas equivalentes y varias réplicas. Para atribuir la diferencia a las señales, normalizar o informar por separado los costes de cada condición. Un único episodio no demuestra emergencia.

## 7. Interfaz del laboratorio
- Canvas 2D con agentes, recursos y zonas peligrosas.
- Visualización opcional de señales emitidas y alcance, desactivable para rendimiento.
- Inspector de criatura: energía, edad, generación, sensores, señal y linaje.
- Controles: iniciar/pausar, paso único, velocidad, reiniciar, cargar/guardar configuración y semilla.
- Panel: población, tasa de supervivencia, energía media, señales/tick y distribución de linajes.
- Exportar CSV/JSON de métricas y metadatos; eventos detallados de modo opcional.

## 8. Métricas y criterio de éxito
- **Ingeniería:** mismos parámetros + misma semilla + misma versión producen los mismos estados/resúmenes.
- **Métrica primaria experimental:** supervivencia acumulada por agente o descendencia viable, **a fijar antes del primer ensayo**.
- **Otras métricas:** evolución poblacional, consumo de recursos, número/coste de señales, asociación señal-contexto, diferencia en conducta de receptores y estabilidad por generaciones.
- **Evidencia preliminar de comunicación funcional:** mejora reproducible frente a controles, respuesta dependiente de señales y reducción del efecto al perturbar/desacoplar el canal.
- La correlación sin controles no demuestra semántica, intención, comunicación causal ni lenguaje.

## 9. Criterios de aceptación verificables
- [ ] Una simulación puede reproducirse exactamente con la misma semilla/configuración/versión.
- [ ] Los agentes sobreviven, mueren y se reproducen según reglas parametrizadas.
- [ ] El canal admite emisión, recepción, alcance, atenuación y coste.
- [ ] No hay significados fijos asociados a señales.
- [ ] La ejecución con canal desactivado es posible sin cambiar otras reglas.
- [ ] Existen gráficos e inspección individual.
- [ ] Se exportan resultados y condiciones de ejecución.
- [ ] Las pruebas cubren invariantes de energía, límites de población, determinismo y controles.
- [ ] Se generan réplicas experimentales comparables antes de evaluar hipótesis.

## 10. Fuera del MVP
Comunicación secuencial, cultura, clanes, engaño, aprendizaje social entre generaciones, depredadores adaptativos, 3D, mundos compartidos, persistencia cloud y entrenamiento con grandes modelos.

## 11. Decisiones que requieren aprobación
- D1: mundo toroidal continuo frente a cuadrícula.
- D2: política de red neuronal pequeña heredable frente a reglas parametrizadas.
- D3: reproducción asexual frente a sexual.
- D4: señal escalar [-1,1] frente a 2–3 canales.
- D5: mantener riesgos estáticos en el MVP.
- D6: fijar la métrica primaria y el protocolo de réplicas en SYN-004, antes de experimentar.
