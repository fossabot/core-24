#!/bin/bash

# script installs blackbox to the workspaces directory
# https://github.com/StackExchange/blackbox

cd /workspaces
git clone https://github.com/StackExchange/blackbox
cd blackbox
sudo make copy-install