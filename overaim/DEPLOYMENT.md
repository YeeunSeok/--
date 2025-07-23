# OverAim EC2 배포 가이드

오버워치 에임 연습 웹사이트를 AWS EC2에 배포하는 완전한 가이드입니다.

## 📋 필요 사항

- AWS 계정
- EC2 인스턴스 (Ubuntu 20.04 LTS 권장)
- 도메인 (선택사항)
- SSH 키 페어

## 🚀 1단계: EC2 인스턴스 생성

### 1.1 EC2 인스턴스 설정
```bash
# 인스턴스 타입: t3.micro (프리티어) 또는 t3.small
# AMI: Ubuntu Server 20.04 LTS
# 스토리지: 20GB GP2
# 보안 그룹: HTTP(80), HTTPS(443), SSH(22) 허용
```

### 1.2 보안 그룹 설정
```
Type        Protocol    Port Range    Source
SSH         TCP         22           0.0.0.0/0 (또는 본인 IP)
HTTP        TCP         80           0.0.0.0/0
HTTPS       TCP         443          0.0.0.0/0
Custom TCP  TCP         3000         0.0.0.0/0 (임시)
```

## 🔧 2단계: EC2 초기 설정

### 2.1 SSH 접속
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 2.2 초기 설정 스크립트 실행
```bash
# 파일 업로드 후
chmod +x ec2-setup.sh
./ec2-setup.sh
```

## 📦 3단계: 애플리케이션 배포

### 3.1 파일 업로드
```bash
# SCP를 이용한 파일 업로드
scp -i your-key.pem -r dist/ ubuntu@your-ec2-ip:/tmp/
scp -i your-key.pem server.js ubuntu@your-ec2-ip:/tmp/
scp -i your-key.pem package-server.json ubuntu@your-ec2-ip:/tmp/package.json
scp -i your-key.pem ecosystem.config.js ubuntu@your-ec2-ip:/tmp/
scp -i your-key.pem deploy.sh ubuntu@your-ec2-ip:/tmp/
```

### 3.2 배포 스크립트 실행
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
cd /tmp
chmod +x deploy.sh
./deploy.sh
```

## 🌐 4단계: Nginx 설정

### 4.1 Nginx 설정 파일 복사
```bash
sudo cp nginx.conf /etc/nginx/sites-available/overaim
sudo ln -s /etc/nginx/sites-available/overaim /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

### 4.2 도메인 설정 (nginx.conf 파일에서)
```nginx
server_name your-domain.com www.your-domain.com;
```

### 4.3 Nginx 재시작
```bash
sudo nginx -t  # 설정 테스트
sudo systemctl restart nginx
```

## 🛡️ 5단계: SSL 인증서 설정 (선택사항)

### 5.1 Certbot 설치
```bash
sudo apt install certbot python3-certbot-nginx
```

### 5.2 SSL 인증서 발급
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📊 6단계: 모니터링 및 관리

### 6.1 PM2 명령어
```bash
pm2 status              # 프로세스 상태 확인
pm2 logs overaim        # 로그 확인
pm2 restart overaim     # 재시작
pm2 stop overaim        # 중지
pm2 delete overaim      # 삭제
pm2 monit              # 실시간 모니터링
```

### 6.2 Nginx 명령어
```bash
sudo systemctl status nginx    # 상태 확인
sudo systemctl restart nginx   # 재시작
sudo nginx -t                 # 설정 테스트
sudo tail -f /var/log/nginx/overaim_access.log  # 액세스 로그
sudo tail -f /var/log/nginx/overaim_error.log   # 에러 로그
```

### 6.3 시스템 리소스 확인
```bash
htop                    # 시스템 리소스
df -h                   # 디스크 사용량
free -h                 # 메모리 사용량
```

## 🔄 7단계: 업데이트 및 배포

### 7.1 새 버전 배포
```bash
# 로컬에서 빌드
npm run build

# 파일 업로드
scp -i your-key.pem -r dist/* ubuntu@your-ec2-ip:/var/www/overaim/

# PM2 재시작
ssh -i your-key.pem ubuntu@your-ec2-ip
pm2 restart overaim
```

### 7.2 자동 배포 (GitHub Actions 등)
```yaml
# .github/workflows/deploy.yml 예시
name: Deploy to EC2
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to EC2
        # SCP 또는 rsync를 이용한 배포 스크립트
```

## 🚨 문제 해결

### 일반적인 문제들

1. **포트 3000에 접근 불가**
   ```bash
   sudo ufw status
   sudo ufw allow 3000
   ```

2. **PM2 프로세스 죽음**
   ```bash
   pm2 logs overaim
   pm2 restart overaim
   ```

3. **Nginx 502 Bad Gateway**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   pm2 status
   ```

4. **메모리 부족**
   ```bash
   free -h
   pm2 restart overaim
   ```

## 📈 성능 최적화

### 7.1 Nginx 캐싱
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 7.2 PM2 클러스터 모드
```javascript
// ecosystem.config.js
instances: 'max',  // CPU 코어 수만큼 인스턴스 생성
exec_mode: 'cluster'
```

### 7.3 Gzip 압축
- Nginx와 Express 모두에서 압축 활성화

## 🔐 보안 권장사항

1. **SSH 키 관리**: 정기적으로 키 교체
2. **방화벽 설정**: 필요한 포트만 열기
3. **자동 업데이트**: 보안 패치 자동 설치
4. **백업**: 정기적인 데이터 백업
5. **모니터링**: 로그 모니터링 및 알림 설정

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- PM2 로그: `pm2 logs overaim`
- Nginx 로그: `/var/log/nginx/overaim_error.log`
- 시스템 로그: `sudo journalctl -u nginx`

---

🎯 **OverAim이 성공적으로 배포되었습니다!**