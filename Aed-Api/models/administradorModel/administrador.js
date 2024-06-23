const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('../../config/db/db'); // Asegúrate de que knex esté configurado previamente

const administrador = {};

administrador.create = async (admin) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Generar un hash de la contraseña antes de almacenarla
            const hash = await bcrypt.hash(admin.contrasena, saltRounds);

            // Insertar el administrador en la base de datos con la contraseña encriptada
            const insertedIds = await knex('Administradores').insert({
                primer_nombre: admin.primer_nombre,
                segundo_nombre: admin.segundo_nombre,
                primer_apellido: admin.primer_apellido,
                segundo_apellido: admin.segundo_apellido,
                email: admin.email,
                numero_de_cedula: admin.numero_de_cedula,
                contrasena: hash, // Almacenar el hash en lugar de la contraseña en texto plano
                telefono: admin.telefono
            });

            console.log('Id del nuevo administrador: ', insertedIds[0]);
            resolve(insertedIds[0]);
        } catch (error) {
            console.error('Error al crear el administrador: ', error);
            reject(error);
        }
    });
};

administrador.edit = async (admin) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateData = {
                primer_nombre: admin.primer_nombre,
                segundo_nombre: admin.segundo_nombre,
                primer_apellido: admin.primer_apellido,
                segundo_apellido: admin.segundo_apellido,
                email: admin.email,
                telefono: admin.telefono
            };

            if (admin.contrasena) {
                const hash = await bcrypt.hash(admin.contrasena, saltRounds);
                updateData.contrasena = hash;
            }

            await knex('Administradores')
                .where({ numero_de_cedula: admin.numero_de_cedula })
                .update(updateData);

            resolve('Administrador actualizado correctamente');
        } catch (error) {
            console.error('Error al editar el administrador: ', error);
            reject(error);
        }
    });
};

administrador.deleteById = async (numero_de_cedula) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedCount = await knex('Administradores')
                .where({ numero_de_cedula })
                .del();

            if (deletedCount > 0) {
                resolve(`Administrador con numero_de_cedula ${numero_de_cedula} eliminado correctamente`);
            } else {
                reject(`No se encontró ningún administrador con numero_de_cedula ${numero_de_cedula}`);
            }
        } catch (error) {
            console.error('Error al eliminar el administrador: ', error);
            reject(error);
        }
    });
};

administrador.findById = async (numero_de_cedula) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admin = await knex('Administradores')
                .where({ numero_de_cedula })
                .first();

            if (admin) {
                resolve(admin);
            } else {
                reject(`No se encontró ningún administrador con numero_de_cedula ${numero_de_cedula}`);
            }
        } catch (error) {
            console.error('Error al buscar el administrador: ', error);
            reject(error);
        }
    });
};

administrador.findAll = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const admins = await knex('Administradores').select('*');
            resolve(admins);
        } catch (error) {
            console.error('Error al obtener los administradores: ', error);
            reject(error);
        }
    });
};

module.exports = administrador;
