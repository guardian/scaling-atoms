#!/usr/bin/env bash

echo "Running start script"

fileExists() {
  test -e "$1"
}

yarn start &
sbt "run 9050"
