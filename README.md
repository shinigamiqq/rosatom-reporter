# Руководство по развертыванию и отключению

## Запуск

Требуется: docker, docker-compose.
```sh
cd rosatom-reporter
docker-compose up --build
```

## Выключение

В корне проекта выполнить команду:
```sh
docker-compose down -v
```
