# SYN-004 — Protocolo experimental preregistrado v1

Estado: especificación del protocolo aprobada como referencia antes de recoger datos. Ningún resultado positivo se presupone.

## Pregunta
¿La evolución de señales escalares heredables mejora una medida de éxito biológico y genera efectos causales sobre receptores, en comparación con controles sin información?

## Condiciones
A: active: el genoma controla emisión y recepción. B: disabled: el canal no llega al receptor, con coste de emisión conservado para distinguir información de ahorro energético. C: shuffled: se permutan intensidades entre emisiones presentes por tick, con distribución y costes conservados; la relación contexto-señal se rompe parcialmente, y se documenta esta limitación.

## Hipótesis primaria
H1: la media del número de descendientes viables por individuo fundador al finalizar 10 000 ticks será mayor en A que en C. Se considera viable un descendiente que alcance 20 ticks. Si hay extinción, se registra como cero. H0: no hay mejora. Se registran tasas de extinción por separado. Comparamos también A contra B (secundario).

## Diseño y tamaño
- Prueba piloto técnica (no confirmatoria) de 5 semillas por condición para calibrar supervivencia y detectar errores.
- Ensayo confirmatorio propuesto: 30 semillas predefinidas por condición, numeradas 1000..1029; misma parametrización general y misma distribución inicial condicionada a semillas.
- Comparación por pares de semillas; como poblaciones evolucionan independientemente, compartir semilla no implica historia idéntica.
- Fijar configuración, código/commit, versión, número de réplicas y métrica **antes** del primer ensayo confirmatorio; cualquier modificación inicia versión nueva.
- El MVP puede exportar métricas de ingeniería antes de implementar la medición completa de descendencia viable; no presentar esos resultados como confirmatorios.

## Estadística
- Estimar diferencia de medias A-C y su intervalo bootstrap percentil del 95% sobre pares de réplicas; reportar mediana, dispersión y datos individuales.
- Reportar tasa de extinción, coste de señales y sensibilidad a valores extremos.
- No usar umbral de p aislado para afirmar lenguaje; mejora y mecanismo deben replicarse.
- Si no se cumplen supuestos de comparación o los datos son escasos, etiquetar como exploratorio.

## Evaluación causal secundaria
- Medir asociación señal/contexto y reacción de los receptores.
- Comparar respuestas ante señales reales frente a señales permutadas.
- Intervención de silenciamiento de canal con genomas congelados durante una ventana y comparación de acciones.
- Ninguna asociación o cambio de supervivencia demuestra por sí solo semántica o intención.

## Amenazas a la validez
- Selección artificial de entornos favorables a coordinarse.
- Diferencia de gasto energético entre tratamientos.
- Variación del PRNG y divergencia posterior entre mundos.
- Información filtrada del estado global o etiquetas semánticas.
- Comparaciones visuales, elección posterior de métricas y extrapolación de un único ensayo.

## Registro de resultados
Exportar fecha, commit y versión del motor, config, semilla, condición, replicación, métricas brutas, resumen y limitaciones. Guardar ensayos confirmatorios en un manifiesto inmutable. Documentar resultados negativos.

## Criterios de cierre
SYN-004 está documentado cuando existen hipótesis, condiciones, replicaciones, métricas, análisis y limitaciones. La ejecución y verificación de 30 réplicas por tratamiento pertenece a SYN-015/016; no confundir protocolo redactado con experimento completado.
