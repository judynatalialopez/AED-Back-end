const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('../../config/db/db'); // Asumiendo que knex está configurado previamente

const usuario = {};

usuario.create = async (usuario) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Verificar que el usuario tenga al menos 55 años
            const fechaNacimiento = new Date(usuario.Fecha_de_Nacimiento);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }
            if (edad < 55) {
                throw new Error('El usuario debe tener al menos 55 años para ser registrado.');
            }

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
                Estado: 1 // Estado por defecto como 1
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

// Login de usuario por email y contraseña
usuario.login = async (Email, Contrasena) => {
    try {
        // Buscar el administrador por email
        const user = await knex('Usuario')
            .where({ Email })
            .first();

        if (!user) {
            throw { kind: 'not_found' };
        }

        // Comparar la contraseña proporcionada con el hash almacenado
        const match = await bcrypt.compare(Contrasena, user.Contrasena);

        if (!match) {
            throw { kind: 'invalid_password' };
        }

        return user;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};


module.exports = usuario;
