cd mariadb
bash ./createGrantPrivileges.sh
mysql -h 127.0.0.1 -u root --password=$MARIADB_ROOT_PASSWORD < ./DataBase.sql
mysql -h 127.0.0.1 -u root --password=$MARIADB_ROOT_PASSWORD < ./grantPrivileges.sql
mysql -h 127.0.0.1 -u $USER_MARIADB --password=$USERPWD_MARIADB TACO < ./schema.sql
