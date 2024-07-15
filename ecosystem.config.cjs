module.exports = {
  apps: [
    {
      name: 'sailvan-print',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};