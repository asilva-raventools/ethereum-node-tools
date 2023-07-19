#!/bin/bash
if [ "$EUID" -ne 0 ]; then
  echo "This script must be run as root"
  exit 1
fi
if [ "$1" != "--docker" ]; then
  add-apt-repository -y ppa:ethereum/ethereum
  apt-get update
  apt-get install -y ethereum curl
  curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
  bash nodesource_setup.sh && rm nodesource_setup.sh
  apt install -y nodejs
fi

cd tools && npm install && npm run init_blockchain

if [ "$1" != "--docker" ]; then
  cp ../data/build/geth.service /etc/systemd/system && chmod +x /etc/systemd/system/geth.service && systemctl daemon-reload && systemctl enable geth.service && systemctl start geth.service
fi