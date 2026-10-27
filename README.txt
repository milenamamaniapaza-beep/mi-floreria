MI FLORERÍA - PRIMERA VERSIÓN WEB

Contenido:
- index.html: pantallas principales y acceso.
- styles.css: diseño adaptable a celular.
- app.js: conexión con Supabase y lectura de tablas.
- manifest.json: configuración básica para instalar desde un navegador compatible.

IMPORTANTE:
1. En app.js, reemplaza REEMPLAZA_CON_TU_CLAVE_sb_publishable por la clave sb_publishable que proporcionaste.
2. No incluyas nunca una clave service_role o secret en esta aplicación.
3. Esta versión es un prototipo inicial: permite crear cuenta/iniciar sesión y consultar registros. Aún no incluye formularios para insertar/editar compras, gastos, pedidos, etc., ni es un APK.
4. Debe publicarse en un sitio HTTPS para probarla como aplicación web. Configura también Redirect URLs en Supabase Auth para el dominio publicado.
5. El acceso a tablas depende de las políticas RLS y de que la cuenta haya iniciado sesión.
