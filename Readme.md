## Setup PosgreSQL user and database

Passwords and logins are for example, you can use them or add your own. Also do not forget to update them in `api/config/config.json`

1. Create role

`CREATE ROLE corma WITH LOGIN PASSWORD 'root';`

2. Create database

`CREATE DATABASE corma_dev;`

3. Grant privileges

`GRANT ALL PRIVILEGES ON DATABASE corma_dev TO corma;`

## Setup Express API

`cd api`

1. Install dependencies

`npm install`

2. Run migrations

`npx sequelize-cli db:migrate`

3. Start

`npm run start`

To create a message you can create one manually or using API endpoint `localhost:3001/create-message`
You have to pass JWT token in headers, and the body format is
```JSON
{
    "content": "azeazeazeae"
}
```

## Setup React APP

`cd app`

1. Install dependencies

`npm install`

2. Start

`npm run start`
