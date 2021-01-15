module.exports = {
  apps: [{
    name: 'app',
    script: 'build/server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    autorestart: true,
    watch: true,
    instances: 0,
    exec_mode: "cluster",
    wait_ready: true,
    max_memory_restart: '300M',
    exp_backoff_restart_delay: 100,
  }],

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
