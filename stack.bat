@echo on
SETLOCAL

set CMD=%1
CALL :%CMD%

:Up
docker volume prune -f
docker compose -p service-web-store-env -f docker/dependencies.yaml up --build -d
docker ps -a
EXIT /B 0

:Down
docker compose -p service-web-store-env -f docker/dependencies.yaml down
EXIT /B 0

:Bounce
CALL :Down
CALL :Up
EXIT /B 0

:Reset
CALL :Down
rm -rf ./docker/data
EXIT /B 0
