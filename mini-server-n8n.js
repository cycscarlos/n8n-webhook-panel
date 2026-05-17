// server.js - Guárdalo en la misma carpeta que tu index.html
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Proxy para n8n – usando pathFilter para preservar la ruta completa
app.use(createProxyMiddleware({
    target: 'http://localhost:5678',
    changeOrigin: true,
    pathFilter: '/webhook',
    logger: console,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[PROXY] ${req.method} ${req.originalUrl} → http://localhost:5678${req.originalUrl}`);
        },
        error: (err, req, res) => {
            console.error(`[PROXY ERROR] ${err.message}`);
        }
    }
}));

const PORT = 5501;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Proxying /webhook/* → http://localhost:5678/webhook/*`);
});