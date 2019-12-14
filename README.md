### Introduction

Project built with [**Nestjs**](https://nestjs.com/), an angular like framework for building server side applications in nodejs. Typeorm is used for managing database.

### create project (a fresh project)

- install nest cli with `npm i -g @nestjs/cli`
- To create the project : `nest new my-project-backend -g` -g for omit git repo.
- Choose npm/yarn as package manager

### Running in development

- run `npm run start:debug`, and set vscode `autoAttach` to `true`(toggle autoAttach true in ctrl+shift+p). so, vscode debugger attaches itself.

### Deployment to server

- Once the project is working and is to be moved to remote server(or a second computer),
  - create database with the name as in ormconfig.json(or viceversa)
  - upload the existing migrations table to the new database if there are any migrations(changes made to entity files after the start of the project and setting `synchronize:false` in ormconfig). This is important since we set migrationsRun to true, and the changes to be done by this migration files is already created with the entities files, errors will be thrown.
  - Now, for the first time running the server, set `synchronize:true` in ormconfig, because it is responsible to create tables. And for this reason upload migrations table to the database prior to running the server first time.
  - Once the server is run and tables are created, set `synchronize:false` forever.
- The commands to run the server is in package.json. To run with pm2, we need to first build the project to dist folder. So a combination of these commands is written into `npm run start-prod` which runs `nest build && pm2 start dist/main.js`

### Dependencies

To use env variables,

- Install dotenv `npm install dotenv`.
- Import and call `config()` in `main.ts` at very top of the file.

To serve static files (eg: for angular frontend):

- Install serve-static `npm install @nestjs/serve-static`
- Add it to AppModule imports and point to build folder of angular frontend project

To use Database with Typeorm, ([TypeOrm integration docs](https://docs.nestjs.com/techniques/sql))

- Install Typeorm and mysql `npm install --save @nestjs/typeorm typeorm mysql`
- Add the database config to AppModule
- for snake_naming of db columns, install `npm i typeorm-naming-strategies` and add it in typeorm config

Validations

- class-validator install : `npm install class-validator class-transformer --save`, use it in dto files.

### Database

- #### Typeorm migrations :
  - the commands in package.json are taken from some github discussions.
  - Migrations are done with setting `migrationsRun:true` in ormconfig and For this set `synchronize:false`.
  - Then any changes needed in db are made in entity files. Now, since these changes wont reflect in db since we set synchronize to false, the changes must be run through migrations.
  - Set `cli.migrationsDir` to appropriate directory. When changes are made to entity files, run `npm run migrations:generate -- {migrationName}`, which will create migrations file in given migrations directory.
  - To update the db with these changes, run `npm run migrations:run -- {migrationName}` or omit migrationName to run all the migrations. Alternatively -
  - Set `migrationsRun:true` in ormconfig, then the migrations are run automatically on server start.
  - ##### What incase I made changes to db directly via db client (like phpmyadmin)?
  - These changes have to be made in entity files and nothing else needed/works.
  - **TYPEORM migration BUG :** I posted this question on [stackoverflow](https://stackoverflow.com/q/59208299/7314900) about this issue. As workaround currently change the generated migration query manually to get desired changes.

### Authentication

- jwt authentication is used and is sent as a **cookie**.
- The cookie will be http only. so it wont show in cookies tab in devtools.We can send the cookie with `{secure:false}`, for the browser to show the cookie, but that would be very unsecure.
- In development mode, For the browser to send the cookie along with req, its httpOptions must have `{withCredentials:true}`
- This creates another problem, that when `withCredentials` is set, cors must not have a wildcard(\*) origin, so the server has to set whitelisted(allowed) origins. For this, in `main.ts`

  ```
  app.enableCors({
      origin:new RegExp(baseUrl)
  })

  ```

### Security Measures

- Refer [Nestjs Documentation](https://docs.nestjs.com/techniques/security) for some packages that can be used.

### Unit testing

- If we want to test with test-db [this library/example may be useful](https://github.com/BrunnerLivio/nestjs-integration-test-db-example)
- nestjs uses 'jest' for testing, opposed to angular which uses 'karma'.

### Miscallaneous

- The Example project contains AuthModule and CategoryModule to show how modules are used.
- The AuthModule has jwt strategy example, taken from nestjs docs.
- The CategoryController inside CategoryModule shows the usage of guards, like the AuthGuard.
- It also shows how error messages can be sent to client based on various conditions.
- both Controllers and services show the usage of helper function `until` to handle async-await in a more elegant manner
- FileUploadModule uses `multer` library to handle file uploads and save to `uploads` folder
