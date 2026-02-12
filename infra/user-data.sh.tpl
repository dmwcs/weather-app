#!/bin/bash
set -euo pipefail

# Install Node.js 22 + git
dnf install -y nodejs22 npm git

# Install pm2 (process manager, keeps service running)
npm install -g pm2 tsx

# Create app directory and environment variables
mkdir -p /home/ec2-user/app
cat > /home/ec2-user/app/.env <<EOL
PORT=${app_port}
AWS_REGION=${aws_region}
COGNITO_USER_POOL_ID=${cognito_user_pool_id}
COGNITO_CLIENT_ID=${cognito_client_id}
EOL

chown -R ec2-user:ec2-user /home/ec2-user/app
