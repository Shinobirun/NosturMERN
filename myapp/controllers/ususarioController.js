const Usuario = require('../models/usuarioModel');

const registrarUsuario = async (req, res) => {
  try {
    const { username, password, perfil } = req.body;

    // Verifica si el perfil es "administrador" o "superusuario"
    if (perfil !== 'administrador' && perfil !== 'superusuario') {
      return res.status(400).json({ mensaje: 'El perfil debe ser "administrador" o "superusuario"' });
    }

    // Verifica si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }

    // Crea el nuevo usuario
    const nuevoUsuario = new Usuario({
      username,
      password,
      perfil,
      estado: 'activo'
    });

    // Guarda el nuevo usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const modificarUsuario = async (req, res) => {
  // Lógica para modificar un usuario
};

module.exports = {
  registrarUsuario,
  modificarUsuario
};
