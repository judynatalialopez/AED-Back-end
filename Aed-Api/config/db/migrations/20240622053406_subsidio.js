exports.up = function(knex) {
    return knex.schema.createTable('subsidio', function(table) {
        table.increments('ID').primary();// Definido como bigint unsigned y no nulo
        table.decimal('Monto', 10, 2).notNullable();
        table.integer('Estado').unsigned().references('ID').inTable('estado_subsidio');
        table.timestamp('Fecha_de_Otorgamiento').defaultTo(knex.fn.now());
        table.bigInteger('ID_Usuario').unsigned().notNullable();

        table.foreign('ID_Usuario').references('Numero_de_Cedula').inTable('Usuario');
    })
    .then(async function() {
        const subsidios = [
            {
                ID_Usuario: 123456789,
                Monto: 500000.00,
                Estado: 1
            },
            {
                ID_Usuario: 987654321,
                Monto: 750000.00,
                Estado: 1
            },
            {
                ID_Usuario: 145263879,
                Monto: 600000.00,
                Estado: 2
            }
        ];

        return knex('subsidio').insert(subsidios);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('subsidio');
};
