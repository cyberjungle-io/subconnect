const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // AI service proxy (put this first)
  app.use('/api/ai', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/api/ai': '', // This will rewrite /api/ai/chat to /chat
    },
    onProxyReq: (proxyReq) => {
      console.log('Proxying request to AI service:', proxyReq.path);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
    }
  }));

  // Your existing backend proxy
  app.use('/api', createProxyMiddleware({
    target: process.env.REACT_APP_W3S_API_URL,
    changeOrigin: true,
  }));
}; 