const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configura EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Modelo de Usuario
const Usuario = mongoose.model('Usuario', {
  username: String,
  password: String
});

// Conecta a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/nosotur', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,  // Añadido para evitar otro tipo de advertencia
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());  // Parsea cuerpos de solicitud JSON

// Rutas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Ruta de registro de usuario
app.post('/registro', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario en la base de datos
    const usuario = new Usuario({
      username,
      password: hashedPassword
    });

    await usuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Manejo de errores 404 y 500
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});

module.exports = app;
