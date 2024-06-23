const subsidioController = require('../controllers/subsidioController');

module.exports = (app) => {
    // Ruta para crear un nuevo subsidio
    app.post('/api/subsidio/create', subsidioController.createSubsidio);

    // Ruta para editar un subsidio existente
    app.put('/api/subsidio/edit/:id', subsidioController.updateSubsidio);

    // Ruta para eliminar un subsidio existente
    app.delete('/api/subsidio/delete/:id', subsidioController.deleteSubsidio);

    // Ruta para obtener un subsidio por ID
    app.get('/api/subsidio/:id', subsidioController.getSubsidio);

    // Ruta para obtener todos los subsidios
    app.get('/api/subsidios', subsidioController.getAllSubsidios);
};
