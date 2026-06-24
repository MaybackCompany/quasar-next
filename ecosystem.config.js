// pm2 start config for quasaracademy.dev (Quasar School).
// Production Next.js server on port 3002, fronted by Cloudflare Tunnel.
// Start: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "quasar-academy",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3002",
      cwd: "C:/Users/Administrator/Projects/quasar-next",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
    },
  ],
};
