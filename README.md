# Schoolwebsite_back

This is the backend of the website made with Node.js

&nbsp;

### How to run

```bash
npm start
```

&nbsp;

### SQL setup

Make sure Mysql is installed

First create database(say db)

```sql
create database db;

```

Now create a table named `school` with schema like this

```sql
use db;
create table school(
    id int not null auto_increment,
    name text not null, 
    address text not null,
    city text not null,
    state text not null,
    contact varchar(15) not null,
    image text not null,
    email text not null,

);

```

To establish MySQL connection locally 

```js
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "db",
  multipleStatements: true,
});
```