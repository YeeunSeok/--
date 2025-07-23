#!/bin/bash

# EC2 인스턴스 초기 설정 스크립트
echo "🔧 EC2 인스턴스 초기 설정 시작..."

# 시스템 업데이트
echo "📦 시스템 업데이트..."
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
echo "📦 필수 패키지 설치..."
sudo apt install -y curl wget git nginx

# Node.js 설치 (NodeSource repository 사용)
echo "📦 Node.js 설치..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 글로벌 설치
echo "📦 PM2 설치..."
sudo npm install -g pm2

# 방화벽 설정
echo "🔒 방화벽 설정..."
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # Node.js (임시, 나중에 제거)
sudo ufw --force enable

# Nginx 시작 및 활성화
echo "🌐 Nginx 설정..."
sudo systemctl start nginx
sudo systemctl enable nginx

# 로그 디렉토리 생성
echo "📂 로그 디렉토리 생성..."
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# 애플리케이션 디렉토리 생성
echo "📁 애플리케이션 디렉토리 생성..."
sudo mkdir -p /var/www/overaim
sudo chown -R $USER:$USER /var/www

# Git 설정 (선택사항)
echo "🔧 Git 글로벌 설정..."
git config --global user.name "OverAim Deploy"
git config --global user.email "deploy@overaim.com"

# 시스템 정보 출력
echo "✅ EC2 설정 완료!"
echo "📊 시스템 정보:"
echo "- OS: $(lsb_release -d | cut -f2)"
echo "- Node.js: $(node --version)"
echo "- NPM: $(npm --version)"
echo "- PM2: $(pm2 --version)"
echo "- Nginx: $(nginx -v 2>&1)"

echo ""
echo "🚀 다음 단계:"
echo "1. 애플리케이션 파일을 업로드하세요"
echo "2. deploy.sh 스크립트를 실행하세요"
echo "3. Nginx 설정을 업데이트하세요"
echo ""
echo "💡 유용한 명령어:"
echo "- PM2 상태 확인: pm2 status"
echo "- PM2 로그 확인: pm2 logs"
echo "- Nginx 상태 확인: sudo systemctl status nginx"
echo "- Nginx 설정 테스트: sudo nginx -t"