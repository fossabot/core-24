#!/bin/bash

# Change permissions of files in workspace to match primary user
sudo chown node -R /workspaces
sudo chgrp node -R /workspaces

cd /workspaces/core

# install Nx CLI tool
npm install -g nx

# install Nest CLI tool
npm install -g @nestjs/cli@^8.1.5

# install Rover CLI tool
./tools/scripts/install-rover.sh

# install blackbox
./tools/scripts/install-blackbox.sh

# install all dependencies
npm i
