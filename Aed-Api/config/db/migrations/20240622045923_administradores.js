const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.up = function(knex) {
    return knex.schema.createTable('Administradores', function(table) {
        table.bigInteger('numero_de_cedula', 12).notNullable().primary();
        table.string('primer_nombre', 25).notNullable();
        table.string('segundo_nombre', 25).nullable();
        table.string('primer_apellido', 25).notNullable();
        table.string('segundo_apellido', 25).nullable();
        table.string('email', 50).notNullable(); // Aumentado a 50 caracteres
        table.string('contrasena', 60).notNullable(); // Aumentado a 60 caracteres para el hash de bcrypt
        table.bigInteger('telefono', 15).notNullable(); // Aumentado a 15 caracteres
    })
    .then(async function() {
        // Inserción de datos con hash de contraseña
        const administradores = [
            {
                primer_nombre: 'Judy',
                segundo_nombre: 'Natalia',
                primer_apellido: 'Correa',
                segundo_apellido: 'Lopez',
                email: 'Natisjcl02@gmail.com',
                numero_de_cedula: '1140914064',
                contrasena: await bcrypt.hash('1140914064Nata', saltRounds),
                telefono: '3239739884',
            },
            {
                primer_nombre: 'Maria',
                segundo_nombre: 'Isaura',
                primer_apellido: 'Novoa',
                segundo_apellido: 'Suarez',
                email: 'isaura@gmail.com',
                numero_de_cedula: '124536987',
                contrasena: await bcrypt.hash('isa1234', saltRounds),
                telefono: '32564987310',
            }
        ];

        // Inserta los datos en la tabla 'Administradores'
        await knex('Administradores').insert(administradores);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Administradores');
};
