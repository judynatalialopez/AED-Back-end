const knex = require('../../config/db/db'); // Asumiendo que knex está configurado previamente

const subsidio = {};

subsidio.create = async (nuevoSubsidio) => {
    return new Promise(async (resolve, reject) => {
        try {
            const insertedIds = await knex('subsidio').insert({
                Monto: nuevoSubsidio.Monto,
                Estado: nuevoSubsidio.Estado,
                Fecha_de_Otorgamiento: nuevoSubsidio.Fecha_de_Otorgamiento || knex.fn.now(),
                ID_Usuario: nuevoSubsidio.ID_Usuario
            });

            console.log('Id del nuevo subsidio: ', insertedIds[0]);
            resolve(insertedIds[0]);
        } catch (error) {
            console.error('Error al crear el subsidio: ', error);
            reject(error);
        }
    });
};

subsidio.edit = async (id, subsidioEditado) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateData = {
                Monto: subsidioEditado.Monto,
                Estado: subsidioEditado.Estado,
                Fecha_de_Otorgamiento: subsidioEditado.Fecha_de_Otorgamiento,
                ID_Usuario: subsidioEditado.ID_Usuario
            };

            await knex('subsidio')
                .where({ ID: id })
                .update(updateData);

            resolve('Subsidio actualizado correctamente');
        } catch (error) {
            console.error('Error al editar el subsidio: ', error);
            reject(error);
        }
    });
};

subsidio.deleteById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedCount = await knex('subsidio')
                .where({ ID: id })
                .del();

            if (deletedCount > 0) {
                resolve(`Subsidio con ID ${id} eliminado correctamente`);
            } else {
                reject(`No se encontró ningún subsidio con ID ${id}`);
            }
        } catch (error) {
            console.error('Error al eliminar el subsidio: ', error);
            reject(error);
        }
    });
};

subsidio.findById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const subsidy = await knex('subsidio')
                .where({ ID: id })
                .first();

            if (subsidy) {
                resolve(subsidy);
            } else {
                reject(`No se encontró ningún subsidio con ID ${id}`);
            }
        } catch (error) {
            console.error('Error al buscar el subsidio: ', error);
            reject(error);
        }
    });
};

subsidio.findAll = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const subsidies = await knex('subsidio').select('*');
            resolve(subsidies);
        } catch (error) {
            console.error('Error al obtener los subsidios: ', error);
            reject(error);
        }
    });
};

subsidio.findByEmail = async (email) => {
    try {
        const usuario = await knex('Usuario')
            .where({ Email: email })
            .first();

        if (!usuario) {
            throw `No se encontró ningún usuario con el email ${email}`;
        }

        const subsidios = await knex('subsidio')
            .where({ ID_Usuario: usuario.Numero_de_Cedula }) // Asegúrate de usar la columna correcta para la relación
            .select('*');

        return subsidios;
    } catch (error) {
        console.error('Error al buscar subsidios por email: ', error);
        throw error;
    }
};

module.exports = subsidio;
