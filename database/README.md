http://www.dwmkerr.com/learn-docker-by-building-a-microservice/


Run mysql:
```
docker run --name awesomeProject -d -e MYSQL_ROOT_PASSWORD=4444 -p 3306:3306 mysql:latest

```

```
docker exec -it awesomeProject /bin/bash

root@36e68b966fd0:/# mysql -uroot -p444
```

Run server: `docker-compose up`
