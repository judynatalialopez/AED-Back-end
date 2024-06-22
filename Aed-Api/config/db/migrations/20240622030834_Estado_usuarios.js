const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.up = function(knex) {
    return knex.schema.createTable('estado_usuario', function(table) {
        table.increments('ID').primary(); // Cambiado a increments para generar automáticamente IDs
        table.string('estado', 25).notNullable();
    })
    .then(async function() {
        // Inserción de datos
        return knex('estado_usuario').insert([
            { estado: 'Activo' },
            { estado: 'Inactivo' }
        ]);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('estado_usuario');
};