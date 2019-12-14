const  {SnakeNamingStrategy} = require("typeorm-naming-strategies")
module.exports =  {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/entities/*.entity.js'],
  migrations:["src/migrations/**/*.js", "dist/migrations/**/*.js"],
  cli:{
    migrationsDir:"src/migrations"
  },
  synchronize: false,
  migrationsRun:true,
  logging: true,
};