const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.up = function(knex) {
    return knex.schema.createTable('Usuario', function(table) {
        table.bigInteger('Numero_de_Cedula').unsigned().notNullable().primary(); // Definir Numero_de_Cedula como clave primaria
        table.string('Primer_Nombre', 25).notNullable();
        table.string('Segundo_Nombre', 25).nullable();
        table.string('Primer_Apellido', 25).notNullable();
        table.string('Segundo_Apellido', 25).nullable();
        table.string('Email', 50).notNullable();
        table.string('Contrasena', 60).notNullable(); // Aumentado para almacenar el hash de bcrypt
        table.date('Fecha_de_Nacimiento').nullable(); // Corregido para permitir nulos
        table.string('Direccion', 45).notNullable();
        table.string('Telefono', 15).notNullable();
        table.timestamp('Fecha_de_Registro').defaultTo(knex.fn.now()); // Fecha de registro se establecerá automáticamente
        table.bigInteger('Numero_de_Cuenta_Ahorro').notNullable(); // Cambiado a bigint para manejar números grandes
        table.integer('Estado').unsigned().notNullable(); // Asegúrate de que sea un entero sin signo

        table.foreign('Estado').references('ID').inTable('estado_usuario'); // Corregido nombre de la tabla referenciada
    })
    .then(async function() {
        // Inserción de datos con hash de contraseña
        const usuarios = [
            {
                Numero_de_Cedula: 123456789,
                Primer_Nombre: 'Juan',
                Segundo_Nombre: 'Carlos',
                Primer_Apellido: 'Perez',
                Segundo_Apellido: 'Gomez',
                Email: 'juancarlosperez@gmail.com',
                Contrasena: await bcrypt.hash('juanito123', saltRounds),
                Fecha_de_Nacimiento: '1950-04-23', // Corregido formato de fecha
                Direccion: 'carrera 123 #45-67', // Corregido nombre de la calle
                Telefono: '320876543', // Corregido número de teléfono
                Numero_de_Cuenta_Ahorro: '12345678902',
                Estado: 2
            },
            {
                Numero_de_Cedula: 987654321,
                Primer_Nombre: 'Maria',
                Segundo_Nombre: 'Luisa',
                Primer_Apellido: 'Rodriguez',
                Segundo_Apellido: 'Lopez',
                Email: 'marialuisa@gmail.com',
                Contrasena: await bcrypt.hash('1234', saltRounds),
                Fecha_de_Nacimiento: '1990-07-15', // Corregido formato de fecha
                Direccion: 'carrera 7 #87-10', // Corregido nombre de la calle
                Telefono: '3111234567', // Corregido número de teléfono
                Numero_de_Cuenta_Ahorro: '0987654321',
                Estado: 1
            },
            {
                Numero_de_Cedula: 145263879,
                Primer_Nombre: 'Carlos',
                Segundo_Nombre: 'Eduardo',
                Primer_Apellido: 'Martinez',
                Segundo_Apellido: 'Ruiz',
                Email: 'ruizcarlos@gmail.com',
                Contrasena: await bcrypt.hash('1234', saltRounds),
                Fecha_de_Nacimiento: '1975-12-01',
                Direccion: 'avenida siempre viva #142', // Corregido nombre de la calle
                Telefono: '3151122334', // Corregido número de teléfono
                Numero_de_Cuenta_Ahorro: '1122334455',
                Estado: 2
            }
        ];

        return knex('Usuario').insert(usuarios);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Usuario');
};
