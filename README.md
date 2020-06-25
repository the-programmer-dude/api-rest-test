# API REST

This api was created with Node.js, Express and PostgreSQL.

# Getting started

## Information

1. The command `yarn knex:migrate` is to create the users table
2. The command `yarn knex:seed` is to add users to table
3. The command `yarn prod:start` is to start production server, and `yarn dev:start` is for development
4. The command `yarn project:debug` is to start debugging on ndb
5. The last command is `yarn knex:destroy`, and it is used to delete all the collections on the database

## Cloning and installing dependencies

To clone and install dependencies:

1. `git clone https://the-programer-dude/api-rest-users.git`
2. `cd api-rest-users`
3. `yarn install` or `npm install`

## Database Config

1. Go to ./src/db/connection.ts
2. Adjust the settings to match your password, user and database
3. Run the migrations and seeds(go to information section to run these commands)
4. Run production or development

## Development setup

Remember, you must have typescript and ts-node-dev installed, and the database must have the correct configurations

You can run development by just typing `yarn dev:start`

## Packages used

1. [Knex](https://knexjs.org) : Knex is a Object Data Modeling (ODM) for SQL databases
2. [JWT](https://jwt.io) : JWT is used to generate tokens for authentication and authorization
3. [Express](https://expressjs.com): Used to create APIs REST, Dinamic Websites
4. [Celebrate](https://www.npmjs.com/package/celebrate) : Celebrate is used to add validation to parameters, headers, body and query

## Release History

- 1.0.1
  - Work in progress

## How to run the requests

1. Install [insomnia](https://insomnia.rest)
2. Click the plus button and then hit "new request"
3. Give a name to it
4. Change the request method to the method that the request you want to do requires
5. Add the required fields(headers, query, params, body)
6. Add endpoint
7. Hit send button to start request

## Contributing

1. [Fork it](https://github.com/the-programmer-dude/api-rest-test/fork)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
