#!/bin/bash
CWD=$(dirname "${BASH_SOURCE[0]}")

cd "${CWD}"
cd ..
npm start --max-old-space-size=256 --optimize-for-size
