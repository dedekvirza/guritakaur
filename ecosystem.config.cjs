module.exports = {
  apps: [{
    name: 'guritakaur',
    script: 'npm',
    args: 'run server',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      JWT_SECRET: 'ganti-dengan-rahasia-anda'
    }
  }]
};
