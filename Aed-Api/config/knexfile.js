const knex = require('knex');

const knexConfig = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'aedbd'
    },
    migrations: {
      directory: 'db/migrations'
    }
  }
};

const db = knex(knexConfig.development);

db.raw('SELECT 1')
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = knexConfig;
