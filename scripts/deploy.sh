#!/bin/bash

# Configuration
URL="https://shahidster.site"
BUILD_DIR="dist"
REMOTE_USER="shahidster.site"
REMOTE_HOST="ssh.gb.stackcp.com"
REMOTE_DIR="public_html" # Adjust if the destination is different

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting deployment process...${NC}"

# 1. Build the project
echo -e "${BLUE}Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Aborting deployment.${NC}"
    exit 1
fi

# 2. Deploy using rsync
echo -e "${BLUE}Deploying files to ${REMOTE_HOST}...${NC}"

# Check for dry-run flag
DRY_RUN=""
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN="--dry-run"
    echo -e "${BLUE}DRY RUN MODE: No files will be uploaded.${NC}"
fi

rsync -avz --progress $DRY_RUN \
    --exclude '.git*' \
    --exclude 'node_modules' \
    --exclude '.DS_Store' \
    "$BUILD_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "Visit: ${URL}"
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi
