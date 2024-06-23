const subsidioModel = require('../models/subsidioModel/subsidio'); // Importar el modelo de subsidio

module.exports = {
    async createSubsidio(req, res) {
        const subsidio = req.body; // Datos del subsidio a crear

        // Insertar el subsidio en la base de datos
        try {
            const data = await subsidioModel.create(subsidio);
            return res.status(201).json({
                success: true,
                message: 'Subsidio creado correctamente',
                data: data // Datos del subsidio creado, incluyendo su ID
            });
        } catch (err) {
            console.error('Error al crear el subsidio: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al crear el subsidio',
                error: err
            });
        }
    },

    async updateSubsidio(req, res) {
        const id = req.params.id; // ID del subsidio a editar
        const subsidio = req.body; // Datos del subsidio a editar

        // Actualizar el subsidio en la base de datos
        try {
            const data = await subsidioModel.edit(id, subsidio);
            return res.status(200).json({
                success: true,
                message: 'Subsidio actualizado correctamente',
                data: data // Datos del subsidio actualizado
            });
        } catch (err) {
            console.error('Error al actualizar el subsidio: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el subsidio',
                error: err
            });
        }
    },

    async deleteSubsidio(req, res) {
        const id = req.params.id; // ID del subsidio a eliminar

        try {
            const result = await subsidioModel.deleteById(id);
            return res.status(200).json({
                success: true,
                message: result // Mensaje de éxito o error del modelo
            });
        } catch (err) {
            console.error('Error al eliminar el subsidio: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar el subsidio',
                error: err
            });
        }
    },

    async getSubsidio(req, res) {
        const id = req.params.id; // ID del subsidio a obtener

        try {
            const subsidio = await subsidioModel.findById(id);
            return res.status(200).json({
                success: true,
                data: subsidio
            });
        } catch (err) {
            console.error('Error al obtener el subsidio: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el subsidio',
                error: err
            });
        }
    },

    async getAllSubsidios(req, res) {
        try {
            const subsidios = await subsidioModel.findAll();
            return res.status(200).json({
                success: true,
                data: subsidios
            });
        } catch (err) {
            console.error('Error al obtener los subsidios: ', err);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los subsidios',
                error: err
            });
        }
    }
};
