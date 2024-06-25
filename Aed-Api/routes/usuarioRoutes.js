const usuarioController = require('../controllers/usuarioController');

module.exports = (app) => {
    // Ruta para registrar un nuevo usuario
    app.post('/api/usuario/create', usuarioController.createUsuario);

    // Ruta para editar un usuario existente
    app.put('/api/usuario/edit/:Numero_de_Cedula', usuarioController.updateUsuario);

    // Ruta para eliminar un usuario existente
    app.delete('/api/usuario/delete/:Numero_de_Cedula', usuarioController.deleteUsuario);

    // Ruta para obtener un usuario por ID
    app.get('/api/usuario/:Numero_de_Cedula', usuarioController.getUsuario);

    // Ruta para obtener todos los usuarios
    app.get('/api/usuarios', usuarioController.getAllUsuarios);

    // Ruta para iniciar sesión de usuario
    app.post('/api/usuario/login', usuarioController.LoginUsuario);
};
