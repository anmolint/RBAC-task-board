# A simple RBAC Task board with Elysia as a server frame work with Bun runtime and PG as Database

## Getting Started

To get started with this project

install bun :

```bash
curl -fsSL https://bun.sh/install | bash
```

after installing it properly
run

```bash
bun install
```

this will install all the dependencies for this repo

now create a Postgres Server and get its connection string

copy the contents of .env.example and create a .env file

## Migrations

to generate migration file
run

```bash
bun run generate
```

after completing this step run

```bash
bun run db:Migrate
```

this will apply migrations to your database

now you are good to go  :smiley:

## Development

To start the development server run:

```bash
bun run dev
```

this will start a server at the port you have set 
eg : ```PORT : 3000``` will lead to server starting at 
http://localhost:3000/ 


