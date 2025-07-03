module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8081,               // 프론트엔드가 실제 띄워진 포트
    proxy: {
      '/api': {
        target: 'http://localhost:8001', // 백엔드 포트
        changeOrigin: true
      }
    }
  }
}