#!/bin/bash
CWD=$(dirname "${BASH_SOURCE[0]}")

cd "${CWD}"
cd ..
npm ci
