#!/bin/bash
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/service/wisatakaur.com || exit
pm2 restart guritakaur
pm2 list
