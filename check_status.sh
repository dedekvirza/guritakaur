#!/bin/bash
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "=== PM2 LOGS ERROR ==="
pm2 logs guritakaur --lines 50 --err --nostream
