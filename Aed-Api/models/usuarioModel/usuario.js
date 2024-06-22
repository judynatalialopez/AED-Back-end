const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('../../config/db/db'); // Asumiendo que knex está configurado previamente

const usuario = {};

usuario.create = async (usuario) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Generar un hash de la contraseña antes de almacenarla
            const hash = await bcrypt.hash(usuario.Contrasena, saltRounds);

            // Insertar el usuario en la base de datos con la contraseña encriptada
            const insertedIds = await knex('Usuario').insert({
                Numero_de_Cedula: usuario.Numero_de_Cedula,
                Primer_Nombre: usuario.Primer_Nombre,
                Segundo_Nombre: usuario.Segundo_Nombre,
                Primer_Apellido: usuario.Primer_Apellido,
                Segundo_Apellido: usuario.Segundo_Apellido,
                Email: usuario.Email,
                Contrasena: hash, // Almacenar el hash en lugar de la contraseña en texto plano
                Fecha_de_Nacimiento: usuario.Fecha_de_Nacimiento,
                Direccion: usuario.Direccion,
                Telefono: usuario.Telefono,
                Fecha_de_Registro: knex.fn.now(),
                Numero_de_Cuenta_Ahorro: usuario.Numero_de_Cuenta_Ahorro,
                Estado: usuario.Estado
            });

            console.log('Id del nuevo usuario: ', insertedIds[0]);
            resolve(insertedIds[0]);
        } catch (error) {
            console.error('Error al crear el usuario: ', error);
            reject(error);
        }
    });
};

usuario.edit = async (usuario) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateData = {
                Primer_Nombre: usuario.Primer_Nombre,
                Segundo_Nombre: usuario.Segundo_Nombre,
                Primer_Apellido: usuario.Primer_Apellido,
                Segundo_Apellido: usuario.Segundo_Apellido,
                Email: usuario.Email,
                Fecha_de_Nacimiento: usuario.Fecha_de_Nacimiento,
                Direccion: usuario.Direccion,
                Telefono: usuario.Telefono,
                Numero_de_Cuenta_Ahorro: usuario.Numero_de_Cuenta_Ahorro,
                Estado: usuario.Estado
            };

            if (usuario.Contrasena) {
                const hash = await bcrypt.hash(usuario.Contrasena, saltRounds);
                updateData.Contrasena = hash;
            }

            await knex('Usuario')
                .where({ Numero_de_Cedula: usuario.Numero_de_Cedula })
                .update(updateData);

            resolve('Usuario actualizado correctamente');
        } catch (error) {
            console.error('Error al editar el usuario: ', error);
            reject(error);
        }
    });
};

usuario.deleteById = async (Numero_de_Cedula) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedCount = await knex('Usuario')
                .where({ Numero_de_Cedula })
                .del();

            if (deletedCount > 0) {
                resolve(`Usuario con Numero_de_Cedula ${Numero_de_Cedula} eliminado correctamente`);
            } else {
                reject(`No se encontró ningún usuario con Numero_de_Cedula ${Numero_de_Cedula}`);
            }
        } catch (error) {
            console.error('Error al eliminar el usuario: ', error);
            reject(error);
        }
    });
};

usuario.findById = async (Numero_de_Cedula) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await knex('Usuario')
                .where({ Numero_de_Cedula })
                .first();

            if (user) {
                resolve(user);
            } else {
                reject(`No se encontró ningún usuario con Numero_de_Cedula ${Numero_de_Cedula}`);
            }
        } catch (error) {
            console.error('Error al buscar el usuario: ', error);
            reject(error);
        }
    });
};

usuario.findAll = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await knex('Usuario').select('*');
            resolve(users);
        } catch (error) {
            console.error('Error al obtener los usuarios: ', error);
            reject(error);
        }
    });
};

module.exports = usuario;
