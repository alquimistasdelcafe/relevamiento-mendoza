# Relevamiento de profesionales del café en Mendoza

Proyecto de Alquimistas del Café. Formulario estático de tres pasos, adaptado al vínculo de cada persona con el sector.

## Estado
Código copiado a la cuenta de Alquimistas. Planilla privada creada en su Drive, con pestaña Respuestas_v3 y 22 columnas. El formulario permanece en modo de prueba: todavía no envía ni guarda respuestas. Falta completar el aviso de privacidad, activar GitHub Pages y desplegar el receptor de Apps Script.

## Activar la recepción
1. Con la cuenta alquimistasdelcafe@gmail.com, abrir la planilla de respuestas creada para este relevamiento.
2. Ir a Extensiones → Apps Script. Reemplazar el código inicial por Code.gs de este repositorio y guardar.
3. Ejecutar setup y autorizar. Esta función vincula exactamente la planilla abierta y configura su zona horaria de Mendoza; no crea otra planilla.
4. Implementar → Nueva implementación → Aplicación web. Ejecutar como la cuenta de Alquimistas. Acceso: cualquier persona. Copiar la URL /exec.
5. Pegar esa URL en config.js, en SURVEY_ENDPOINT. Nunca publicar credenciales ni respuestas en GitHub.
6. En Settings → Pages, seleccionar Deploy from a branch → main → / (root).
7. Probar un envío sin sesión de Google, verificar una sola fila en Sheets y eliminar esa fila de prueba antes de difundir.

La planilla permanece privada. No activar acceso público ni publicar por enlace.

## Datos
Se guardan Fecha, ID, los 16 campos del esquema y email, novedades, consentimiento y Version. El correo solo se conserva cuando hay aceptación expresa para actividades de la comunidad y capacitaciones. Los permisos anteriores para entrevistas no habilitan este uso.
El servidor valida valores, descarta campos ajenos al recorrido, neutraliza fórmulas y evita duplicar reintentos mediante ID. Las respuestas van por POST a Google; la confirmación aparece después del guardado.

## Antes de difundir
Completar identificación y domicilio del responsable, derechos, conservación y demás puntos del aviso de privacidad definidos con el equipo. La aceptación de contacto es independiente del consentimiento del relevamiento. Este sondeo voluntario no representa automáticamente a todo el sector.

## Verificación
La lógica de recorridos y validaciones tiene pruebas locales previas. La copia de código y los encabezados de la planilla fueron revisados. Pendientes: activación de Pages, prueba visual del nuevo sitio y envío real a Apps Script. Configuración vacía mantiene el modo de prueba.
