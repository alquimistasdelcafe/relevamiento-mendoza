# Provincia: actualización compatible

Estado: preparada y probada con datos simulados. No publicar el frontend antes de actualizar y verificar el receptor de Apps Script.

## Orden de publicación

1. Abrir el proyecto Apps Script vinculado a la planilla real con la cuenta Alquimistas. Comparar su código desplegado con la versión actual del repositorio antes de reemplazarlo; conservar cualquier cambio no sincronizado y guardar una copia de la versión desplegada.
2. Probar este Code.gs en un proyecto y una planilla de prueba, con los mismos 27 encabezados. Ejecutar setup allí y desplegar una aplicación web de prueba. Verificar envíos Mendoza, Córdoba y CABA, una página v3 anterior y reintentos del mismo ID. No usar correos reales.
3. En el proyecto de producción, actualizar Code.gs y editar la implementación existente con una nueva versión, conservando su URL /exec y los permisos actuales. La primera respuesta válida agrega provincia en AB, tras comprobar A:AA. Las filas históricas no se reescriben. La versión anterior del formulario continúa siendo aceptada.
4. Verificar un envío marcado como prueba, sin correo, y su provincia en AB. Identificar la fila con ID; excluirla del análisis. Si falla, no publicar el frontend.
5. Integrar esta rama a main. index.html carga logic.js y app.js con una nueva versión de caché. Verificar en el sitio publicado Mendoza, Córdoba y CABA y la confirmación de guardado.

## Conservación de datos

- A:AA conservan orden, nombres y valores históricos; provincia se agrega como AB.
- Mendoza exige un departamento de los 18 existentes.
- Otras provincias/CABA guardan departamento = Fuera de Mendoza y provincia elegida en AB.
- Formularios v3 sin provincia siguen funcionando: si indican un departamento mendocino, los nuevos envíos guardan Mendoza; si indican Fuera de Mendoza, la provincia queda vacía. No se inventa la ubicación de respuestas históricas.
- El ID sigue evitando duplicados; el consentimiento y contacto opcional no cambian.

## Pruebas locales

Ejecutar `node test-provinces.cjs`. Usa un receptor y una planilla simulados: no llama a Google ni altera respuestas reales. Comprueba todas las jurisdicciones, validación condicional, conservación de columnas y filas, compatibilidad v3, reintentos y rechazo de estructuras incompatibles.

## Reversión

Si el frontend presenta problemas, revertir el commit de publicación; el receptor nuevo sigue aceptando v3. Si se necesita restaurar también el receptor anterior, hacerlo después del frontend. El receptor anterior escribe A:AA y no modifica AB; los envíos nuevos con versión v3-provincia serán rechazados hasta que se recargue la página anterior.
