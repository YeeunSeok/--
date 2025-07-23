#!/bin/bash

# EC2 배포 스크립트
echo "🚀 OverAim EC2 배포 시작..."

# 변수 설정
APP_NAME="overaim"
APP_DIR="/var/www/overaim"
NGINX_CONFIG="/etc/nginx/sites-available/overaim"
PM2_ECOSYSTEM="ecosystem.config.js"

# 1. 애플리케이션 디렉토리 생성
echo "📁 애플리케이션 디렉토리 설정..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 2. 빌드된 파일 복사
echo "📦 빌드 파일 복사..."
sudo cp -r dist/* $APP_DIR/

# 3. Node.js 서버 설정 (정적 파일 서빙용)
echo "⚙️ Node.js 서버 설정..."
cat > $APP_DIR/server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname)));

// SPA를 위한 catch-all 핸들러
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎯 OverAim 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
EOF

# 4. package.json 생성
echo "📋 package.json 생성..."
cat > $APP_DIR/package.json << 'EOF'
{
  "name": "overaim-server",
  "version": "1.0.0",
  "description": "OverAim Production Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# 5. 의존성 설치
echo "📦 의존성 설치..."
cd $APP_DIR
sudo npm install

# 6. PM2 ecosystem 파일 생성
echo "🔧 PM2 설정..."
cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'overaim',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/overaim-err.log',
    out_file: '/var/log/pm2/overaim-out.log',
    log_file: '/var/log/pm2/overaim.log',
    time: true
  }]
};
EOF

# 7. PM2로 애플리케이션 시작
echo "🚀 PM2로 애플리케이션 시작..."
sudo pm2 delete overaim 2>/dev/null || true
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup

echo "✅ 배포 완료!"
echo "🌐 애플리케이션이 http://localhost:3000 에서 실행 중입니다."