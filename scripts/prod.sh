#!/bin/bash
echo "🚀 Iniciando FikaFood en modo producción..."
docker-compose -f docker-compose.prod.yml up -d --build

