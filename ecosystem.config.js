module.exports = {
  apps : [{
    name: 'API',
    cwd: '.',
    script: 'sudo',
    args: 'docker-compose up --build',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
