# CPSC 408 Database Management Final Project

## Team Members:
- Matt Favela
- Julian Carbajal

# Instructions

1. ```npm run setup```
2. ```npm run start:both```

# Notes
1. Main main frontend HTML, CSS and JS React code is in /src
2. The backend is a seperate server ran from /backend
3. IMPORTANT in the DataBase we need to use older support authentication methods so run the following command in a MySql Console
```
ALTER USER 'YOURUSERNAMEHERE'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YOURPASSWORDHERE';
FLUSH PRIVILEGES;
```