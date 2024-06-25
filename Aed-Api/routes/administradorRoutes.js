const administradorController = require('../controllers/administradorController');

module.exports = (app) => {
    // Ruta para registrar un nuevo administrador
    app.post('/api/administrador/create', administradorController.createAdministrador);

    // Ruta para actualizar un administrador existente
    app.put('/api/administrador/update/:id', administradorController.updateAdministrador);

    // Ruta para eliminar un administrador existente
    app.delete('/api/administrador/delete/:numero_de_cedula', administradorController.deleteAdministrador);

    // Ruta para obtener un administrador por número de cédula
    app.get('/api/administrador/:numero_de_cedula', administradorController.getAdministrador);

    // Ruta para obtener todos los administradores
    app.get('/api/administradores', administradorController.getAllAdministradores); 

    // Ruta para el login de administrador
    app.post('/api/administrador/login', administradorController.loginAdministrador);
};
