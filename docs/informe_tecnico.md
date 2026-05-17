# 📊 Informe Técnico de Proyecto: Panel Controlador de Webhooks (n8n)

## 🎯 Objetivo del Proyecto
El objetivo principal de **n8n-webhook-panel** es proporcionar un panel de control local (Dashboard) visualmente atractivo, intuitivo y de fácil acceso para disparar y gestionar flujos de automatización (workflows) construidos en la plataforma **n8n**. 

Este panel permite a los usuarios o administradores ejecutar procesos bajo demanda (como "Purga de Drive" o "Generación de Newsletter con IA") y probar webhooks personalizados, sin necesidad de ingresar al entorno de desarrollo complejo de n8n. Además, facilita la visualización en tiempo real de los registros de ejecución (Logs).

## 🏗️ Arquitectura Utilizada
El proyecto está construido bajo una arquitectura **Cliente-Servidor ligera (Monolítica Front-Back local)** orientada a microservicios proxy, compuesta por dos capas principales:

### 1. Frontend (Capa de Presentación e Interacción)
*   **Tecnologías:** HTML5 puro, CSS3 moderno y Vanilla JavaScript (`index.html`).
*   **Diseño (UI/UX):** Implementa un diseño adaptable (Responsive) con estética "Glassmorphism" (desenfoques y transparencias), soporte para modo Claro/Oscuro dinámico, y accesibilidad estructurada. Utiliza la tipografía *Inter* y la librería de iconos *FontAwesome*.
*   **Gestión de Estado y Notificaciones:** Utiliza `localStorage` para la persistencia del tema visual y la librería **Toastify.js** para notificaciones interactivas no intrusivas.
*   **Lógica de Negocio en Cliente:** Utiliza el API `fetch` nativa de JavaScript para realizar peticiones HTTP asíncronas hacia los endpoints del servidor proxy local.

### 2. Backend (Capa Middleware / Servidor de Proxy)
*   **Entorno:** Node.js.
*   **Core:** Un servidor minimalista implementado en el archivo `mini-server-n8n.js` utilizando **Express.js**.
*   **Manejo de CORS y Enrutamiento:** Utiliza el paquete `cors` para la seguridad de orígenes cruzados. El servidor tiene la doble función de despachar el archivo estático (`index.html`) y actuar como middleware para enrutar las peticiones al motor n8n.

## 🔄 Interacción con la Plataforma n8n
La comunicación entre este panel de control y el núcleo de n8n es uno de los puntos clave, y se realiza mediante un **Proxy Inverso**:

1.  **Protección de CORS y Seguridad:** Puesto que el frontend (puerto 5501) y n8n (habitualmente puerto 5678) operan en puertos distintos, realizar peticiones `fetch` directas desde el navegador hacia n8n generaría errores de CORS.
2.  **http-proxy-middleware:** El backend soluciona esto utilizando este paquete. El frontend envía las peticiones (POST o GET) a la ruta local `/webhook/...`.
3.  **Redirección Transparente:** El servidor Express captura todas las llamadas a la ruta `/webhook` y las reenvía instantánea y transparente al objetivo `http://localhost:5678` (el servidor de n8n local).
4.  **Flujo Final:** El flujo de n8n se activa a través de su nodo *Webhook trigger*. Una vez que n8n procesa la automatización, devuelve un código HTTP (por ejemplo, 200 OK) a través del proxy hacia el frontend, el cual actualiza inmediatamente los logs visuales y notifica al usuario del éxito o fracaso de la tarea.

## 💡 Conclusión
Se trata de una solución técnica muy elegante, robusta y ligera. Al usar un servidor intermedio Node.js que oficia de proxy, resuelve de raíz las complicaciones típicas de CORS en navegadores. Además, el frontend está completamente desacoplado y es altamente personalizable, lo que lo convierte en una excelente herramienta para escalar y administrar flujos de trabajo de n8n a nivel operativo para usuarios no técnicos.
