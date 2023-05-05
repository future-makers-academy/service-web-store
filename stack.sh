#!/bin/bash

function up {
  docker volume prune -f
  docker compose -p service-web-store-env -f docker/dependencies.yaml up --build -d
  docker ps -a
}

function down {
  docker compose -p service-web-store-env -f docker/dependencies.yaml down
}

function bounce {
   down
   up
}

function reset {
  down
  rm -rf ./docker/data
}

${1}
