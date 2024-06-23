const bcrypt = require('bcrypt');
const saltRounds = 10;
const administradorModel = require('../models/administradorModel/administrador'); // Importar el modelo de administrador

module.exports = {
    async createAdministrador(req, res) {
        const admin = req.body; // Datos del administrador a crear

        try {
            // Generar un hash de la contraseña antes de almacenarla
            const hash = await bcrypt.hash(admin.contrasena, saltRounds);
            admin.contrasena = hash; // Reemplazar la contraseña con su hash

            // Insertar el administrador en la base de datos
            const data = await administradorModel.create(admin);
            return res.status(201).json({
                success: true,
                message: 'Administrador creado correctamente',
                data: data // Datos del administrador creado, incluyendo su ID
            });
        } catch (err) {
            console.error('Error al crear el administrador: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al crear el administrador',
                error: err
            });
        }
    },

    async updateAdministrador(req, res) {
        const admin = req.body; // Datos del administrador a editar
        const { id } = req.params; // Obtener el ID del administrador de los parámetros de la URL

        // Verificar si se está proporcionando una nueva contraseña
        if (admin.contrasena) {
            try {
                // Generar un hash de la nueva contraseña antes de almacenarla o actualizarla
                const hash = await bcrypt.hash(admin.contrasena, saltRounds);
                admin.contrasena = hash; // Reemplazar la contraseña con su hash
            } catch (err) {
                console.error('Error al generar el hash de la contraseña: ', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el administrador',
                    error: err
                });
            }
        }

        // Actualizar el administrador en la base de datos
        try {
            const data = await administradorModel.update(id, admin);
            if (data.kind === 'not_found') {
                return res.status(404).json({
                    success: false,
                    message: 'Administrador no encontrado'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Administrador actualizado correctamente',
                data: data // Datos del administrador actualizado
            });
        } catch (err) {
            console.error('Error al actualizar el administrador: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el administrador',
                error: err
            });
        }
    },

    async updatePassword(req, res) {
        const { id } = req.params; // Obtener el ID del administrador de los parámetros de la URL
        const { contrasena } = req.body; // Obtener la nueva contraseña del cuerpo de la solicitud

        if (!contrasena) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña es obligatoria'
            });
        }

        try {
            // Generar un hash de la nueva contraseña antes de almacenarla
            const hash = await bcrypt.hash(contrasena, saltRounds);

            // Actualizar solo la contraseña en la base de datos
            const data = await administradorModel.update(id, { contrasena: hash });
            if (data.kind === 'not_found') {
                return res.status(404).json({
                    success: false,
                    message: 'Administrador no encontrado'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Contraseña actualizada correctamente',
                data: data // Datos del administrador actualizado
            });
        } catch (err) {
            console.error('Error al actualizar la contraseña del administrador: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar la contraseña del administrador',
                error: err
            });
        }
    },

    async deleteAdministrador(req, res) {
        const { numero_de_cedula } = req.params; // Obtener el número de cédula de los parámetros de la URL

        try {
            const result = await administradorModel.deleteById(numero_de_cedula);
            return res.status(200).json({
                success: true,
                message: result // Mensaje de éxito o error del modelo
            });
        } catch (err) {
            console.error('Error al eliminar el administrador: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar el administrador',
                error: err
            });
        }
    },

    async getAdministrador(req, res) {
        const { numero_de_cedula } = req.params; // Obtener el número de cédula de los parámetros de la URL

        try {
            const admin = await administradorModel.findById(numero_de_cedula);
            return res.status(200).json({
                success: true,
                data: admin
            });
        } catch (err) {
            console.error('Error al obtener el administrador: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el administrador',
                error: err
            });
        }
    },

    async getAllAdministradores(req, res) {
        try {
            const admins = await administradorModel.findAll();
            return res.status(200).json({
                success: true,
                data: admins
            });
        } catch (err) {
            console.error('Error al obtener los administradores: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los administradores',
                error: err
            });
        }
    }
};
