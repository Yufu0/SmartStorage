set -o allexport
source .env set
+o allexport

mongosh "mongodb://${MONGODB_INITDB_ROOT_USERNAME}:${MONGODB_INITDB_ROOT_PASSWORD}@localhost:${MONGO_PORT}/?directConnection=true" \
  --eval "db.getSiblingDB('${MONGO_DATABASE}').createCollection('${MONGO_COLLECTION_USERS}');db.getSiblingDB('${MONGO_DATABASE}').${MONGO_COLLECTION_USERS}.insertOne({ username: '${APP_USERNAME}', password: '${APP_PASSWORD}' });"
