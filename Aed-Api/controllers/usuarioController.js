const bcrypt = require('bcrypt');
const saltRounds = 10;
const usuarioModel = require('../models/usuarioModel/usuario'); // Importar el modelo de usuario

module.exports = {
    async createUsuario(req, res) {
        const usuario = req.body; // Datos del usuario a crear

        // Generar un hash de la contraseña antes de almacenarla
        bcrypt.hash(usuario.Contrasena, saltRounds, async (err, hash) => {
            if (err) {
                console.error('Error al generar el hash de la contraseña: ', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear el usuario',
                    error: err
                });
            }

            // Reemplazar la contraseña con su hash antes de insertar en la base de datos
            usuario.Contrasena = hash;

            // Insertar el usuario en la base de datos
            try {
                const data = await usuarioModel.create(usuario);
                return res.status(201).json({
                    success: true,
                    message: 'Usuario creado correctamente',
                    data: data // Datos del usuario creado, incluyendo su ID
                });
            } catch (err) {
                console.error('Error al crear el usuario: ', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear el usuario',
                    error: err
                });
            }
        });
    },

    async updateUsuario(req, res) {
        const usuario = req.body; // Datos del usuario a editar

        // Verificar si se está proporcionando una nueva contraseña
        if (usuario.Contrasena) {
            try {
                // Generar un hash de la nueva contraseña antes de almacenarla o actualizarla
                const hash = await bcrypt.hash(usuario.Contrasena, saltRounds);
                usuario.Contrasena = hash; // Reemplazar la contraseña con su hash
            } catch (err) {
                console.error('Error al generar el hash de la contraseña: ', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el usuario',
                    error: err
                });
            }
        }

        // Actualizar el usuario en la base de datos
        try {
            const data = await usuarioModel.edit(usuario);
            return res.status(200).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: data // Datos del usuario actualizado
            });
        } catch (err) {
            console.error('Error al actualizar el usuario: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el usuario',
                error: err
            });
        }
    },


    async deleteUsuario(req, res) {
        const { Numero_de_Cedula } = req.params; // Obtener el número de cédula de los parámetros de la URL

        try {
            const result = await usuarioModel.deleteById(Numero_de_Cedula);
            return res.status(200).json({
                success: true,
                message: result // Mensaje de éxito o error del modelo
            });
        } catch (err) {
            console.error('Error al eliminar el usuario: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar el usuario',
                error: err
            });
        }
    },

    async getUsuario(req, res) {
        const { Numero_de_Cedula } = req.params; // Obtener el número de cédula de los parámetros de la URL

        try {
            const usuario = await usuarioModel.findById(Numero_de_Cedula);
            return res.status(200).json({
                success: true,
                data: usuario
            });
        } catch (err) {
            console.error('Error al obtener el usuario: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el usuario',
                error: err
            });
        }
    },

    async getAllUsuarios(req, res) {
        try {
            const usuarios = await usuarioModel.findAll();
            return res.status(200).json({
                success: true,
                data: usuarios
            });
        } catch (err) {
            console.error('Error al obtener los usuarios: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los usuarios',
                error: err
            });
        }
    }
};
