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
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/overaim-err.log',
    out_file: '/var/log/pm2/overaim-out.log',
    log_file: '/var/log/pm2/overaim.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 4000
  }],
  
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-ec2-ip-address',  // EC2 인스턴스 IP로 변경
      ref: 'origin/main',
      repo: 'https://github.com/your-username/overaim.git',  // 실제 저장소로 변경
      path: '/var/www/overaim',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};