const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('../../config/db/db'); // Asegúrate de que knex esté configurado previamente

const administrador = {};

// Crear un nuevo administrador
administrador.create = async (admin) => {
    try {
        // Generar un hash de la contraseña antes de almacenarla
        const hash = await bcrypt.hash(admin.contrasena, saltRounds);

        // Insertar el administrador en la base de datos con la contraseña encriptada
        const [insertedId] = await knex('Administradores').insert({
            primer_nombre: admin.primer_nombre,
            segundo_nombre: admin.segundo_nombre,
            primer_apellido: admin.primer_apellido,
            segundo_apellido: admin.segundo_apellido,
            email: admin.email,
            numero_de_cedula: admin.numero_de_cedula,
            contrasena: hash, // Almacenar el hash en lugar de la contraseña en texto plano
            telefono: admin.telefono
        });

        console.log('Id del nuevo administrador: ', insertedId);
        return insertedId;
    } catch (error) {
        console.error('Error al crear el administrador: ', error);
        throw error;
    }
};

// Actualizar un administrador
administrador.update = async (numero_de_cedula, adminData) => {
    try {
        const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, contrasena, email, telefono } = adminData;

        const updateData = {
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            email,
            telefono
        };

        if (contrasena) {
            // Generar el hash de la nueva contraseña
            const hash = await bcrypt.hash(contrasena, saltRounds);
            updateData.contrasena = hash;
        }

        const updatedRows = await knex('Administradores')
            .where({ numero_de_cedula })
            .update(updateData);

        if (updatedRows === 0) {
            return { kind: 'not_found' };
        }

        console.log('Administrador actualizado correctamente');
        return { message: 'Administrador actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar el administrador:', error);
        throw error;
    }
};

// Eliminar un administrador por su número de cédula
administrador.deleteById = async (numero_de_cedula) => {
    try {
        const deletedCount = await knex('Administradores')
            .where({ numero_de_cedula })
            .del();

        if (deletedCount === 0) {
            throw { kind: 'not_found' };
        }

        return `Administrador con numero_de_cedula ${numero_de_cedula} eliminado correctamente`;
    } catch (error) {
        console.error('Error al eliminar el administrador:', error);
        throw error;
    }
};

// Buscar un administrador por su número de cédula
administrador.findById = async (numero_de_cedula) => {
    try {
        const admin = await knex('Administradores')
            .where({ numero_de_cedula })
            .first();

        if (!admin) {
            throw { kind: 'not_found' };
        }

        return admin;
    } catch (error) {
        console.error('Error al buscar el administrador:', error);
        throw error;
    }
};

// Obtener todos los administradores
administrador.findAll = async () => {
    try {
        const admins = await knex('Administradores').select('*');
        return admins;
    } catch (error) {
        console.error('Error al obtener los administradores:', error);
        throw error;
    }
};

module.exports = administrador;
