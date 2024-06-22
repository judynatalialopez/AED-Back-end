const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.up = function(knex) {
    return knex.schema.createTable('Estado_subsidio', function(table) {
        table.increments('ID').primary(); // Cambiado a increments para generar automáticamente IDs
        table.string('estado', 25).notNullable();
    })
    .then(async function() {
        // Inserción de datos
        return knex('Estado_subsidio').insert([
            { estado: 'Reclamado' },
            { estado: 'No Reclamado' }
        ]);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Estado_subsidio');
};
