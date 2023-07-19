FROM ubuntu:jammy

SHELL ["/bin/bash", "-c"]

WORKDIR /opt/ethereum

COPY . .

RUN apt-get update && \ 
  apt-get install -y software-properties-common && \
  add-apt-repository -y ppa:ethereum/ethereum && \ 
  apt-get update && \ 
  apt-get install -y ethereum curl && \ 
  curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh && \
  bash nodesource_setup.sh && rm nodesource_setup.sh && \
  apt install -y nodejs && \
  chmod +x install.sh && \ 
  chmod +x entrypoint.sh

EXPOSE 8545
EXPOSE 8546

ENTRYPOINT ./install.sh --docker && ./entrypoint.sh