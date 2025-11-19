// PM2 Ecosystem Configuration
// ใช้สำหรับจัดการ process บน production

module.exports = {
  apps: [{
    name: 'spu-activity-hub',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/spu-activity-hub'
    },
    // Auto restart
    watch: false,
    max_memory_restart: '500M',
    
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Advanced settings
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true
  }]
};

