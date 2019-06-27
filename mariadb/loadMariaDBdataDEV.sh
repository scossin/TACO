docker exec -i mariadbTaco /bin/bash -c "mysql -h 127.0.0.1 -u root --password='rootpwd'" < ./DataBase.sql
docker exec -i mariadbTaco /bin/bash -c "mysql -h 127.0.0.1 -u hemovigilants --password=hemovigilantspwd TACO" < ./schema.sql
