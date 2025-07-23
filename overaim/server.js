const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// 보안 미들웨어
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}));

// Gzip 압축
app.use(compression());

// 정적 파일 서빙 (캐시 헤더 포함)
app.use(express.static(path.join(__dirname), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // HTML 파일은 캐시하지 않음
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API 라우트 (필요시 확장)
app.get('/api/status', (req, res) => {
  res.json({
    app: 'OverAim',
    version: '1.0.0',
    status: 'running'
  });
});

// SPA를 위한 catch-all 핸들러
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 핸들링
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// 서버 종료 처리
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🎯 OverAim 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🕐 시작 시간: ${new Date().toISOString()}`);
});