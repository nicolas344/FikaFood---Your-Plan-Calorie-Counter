#!/bin/bash
echo "⏹️  Deteniendo FikaFood..."
docker-compose down
docker-compose -f docker-compose.prod.yml down

