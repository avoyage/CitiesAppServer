#!/bin/sh

# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."
docker run --name awesomeProject -d \
  -e MYSQL_ROOT_PASSWORD=4444 \
  -e MYSQL_DATABASE=cities -e MYSQL_USER=users_service -e MYSQL_PASSWORD=123 \
  -p 3306:3306 \
  mysql:latest

# Wait for the database service to start up.
echo "Waiting for DB to start up..."
docker exec awesomeProject mysqladmin --silent --wait=30 -uusers_service -p123 ping || exit 1

# Run the setup script.
echo "Setting up initial data..."
docker exec -i awesomeProject mysql -uusers_service -p123 users < setup.sql
