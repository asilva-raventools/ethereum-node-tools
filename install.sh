#!/bin/bash
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum curl
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh && rm nodesource_setup.sh
sudo apt install -y nodejs
cd tools && npm install && npm run init_blockchain
sudo mv ../data/build/geth.service /etc/systemd/system && chmod +x /etc/systemd/system/geth.service && sudo systemctl daemon-reload && systemctl enable geth.service && systemctl start geth.service