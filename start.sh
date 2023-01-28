#!/bin/bash
CWD=$(dirname "${BASH_SOURCE[0]}")

cd ${CWD}
npm start --max-old-space-size=256 --optimize-for-size
