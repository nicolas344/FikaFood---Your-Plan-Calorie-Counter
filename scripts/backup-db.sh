#!/bin/bash
echo "💾 Creando backup de la base de datos..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p backups
docker cp fikafood_backend:/app/data/db.sqlite3 ./backups/db_backup_$TIMESTAMP.sqlite3
echo "✅ Backup creado: ./backups/db_backup_$TIMESTAMP.sqlite3"

