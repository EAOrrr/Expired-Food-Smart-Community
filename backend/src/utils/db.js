const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const path = require('path')
const { DATABASE_URL } = require('./config')

// connect docker postgresql database
const sequelize = new Sequelize(DATABASE_URL, )


// connect azure postgresql database
// const sequelize = new Sequelize(DATABASE_URL,
//   {
//     dialect: 'postgres',
//     dialectOptions: {
//       entrypt: true,
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       }
//     },
//   }
// )

// connect heroku postgresql database
// const sequelize = new Sequelize(DATABASE_URL, {
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
// })

const migrationConf = {
  migrations: {
    glob: path.join(__dirname, '../migrations/*.js'),
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
  sequelize.close()
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()

  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {

  try {
    console.log('try to connect')
    await sequelize.authenticate()
    await runMigrations()
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed', err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }