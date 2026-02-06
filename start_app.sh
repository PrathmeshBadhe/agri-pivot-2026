#!/bin/bash

# Green color for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${GREEN}🌱 Starting Agri-Pivot AI System...${NC}\n"

# 1. Check Node
if ! command -v node &> /dev/null
then
    echo -e "${RED}[ERROR] Node.js could not be found. Please install it.${NC}"
    exit 1
fi

# 2. Frontend Deps
echo -e "${YELLOW}[INFO] Checking Frontend Dependencies...${NC}"
if [ ! -d "frontend_ts/node_modules" ]; then
    echo -e "Installing npm packages..."
    cd frontend_ts
    npm install
    cd ..
else
    echo -e "${GREEN}[OK] Frontend ready.${NC}"
fi

# 3. Backend Deps
echo -e "${YELLOW}[INFO] Checking Backend Environment...${NC}"
if ! command -v python3 &> /dev/null
then
    echo -e "${RED}[ERROR] Python3 could not be found.${NC}"
    exit 1
fi

cd backend
# Simple check - just install to be safe (pip is fast if cached)
pip3 install -r requirements.txt > /dev/null 2>&1
cd ..

# 4. Launch
echo -e "\n${GREEN}🚀 Launching Agri-Pivot AI (Frontend + Backend)...${NC}\n"
cd frontend_ts
npm run start-all
