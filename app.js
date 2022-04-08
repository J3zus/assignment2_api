const express = require('express'); //Importar express
const app = express(); //Crea una instancioa de express
const morgan = require('morgan');
const config = require('config');
const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const  students = require('./routes/students.js'); //Importa el archivo con las ruta para los estudiantes
const  curses = require('./routes/courses.js'); //Importa el archivo con las ruta para los estudiantes

//JSON hace un parsing de la entrada a formato JSON
//De tal forma que lo que recibamos 
app.use(express.json()); //Se le dice a express que use este middleware
app.use(express.urlencoded({extended: true})); //Middleware que cambia o transforma nuestras entradas.


//Public es el nombre de la carpeta que tendra los recursos estaticos.
app.use(express.static('public')); //Este middleware, Define la ruta para acceder a los recursos estaticos y poder desplegarlos dentro de la aplicacion. 
app.use('/api/students', students);
app.use('/api/courses', curses);

console.log(`Aplicacion: ${config.get('nombre')}`);
console.log(`DB Server: ${config.get('configDB.host')}`);

//Uso de middleware de tercero - morgan
if(app.get('env') == 'development'){ //Env es una propiedad del objeto config que nos va a decir en que entorno estamos trabajando (variable de entorno)
    app.use(morgan('tiny'));
    //console.log('Morgan est habilitado ...');
    inicioDebug('Morgan esta habilitado...')
}

//Operaciones con la base de datos
dbDebug('Conectando a la base de datos')

//Consulra en la ruta raiz de nuestro servidor
//con una funcion callback
app.get('/',(req, res)=>{
    res.send('Welcome to Individual Assignment - 02');
});

//Usando el modulo process, se lee una variable de entorno.
// Si la variable no existe, va a tomar un valor por default(3000)

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Escuchando en el puerto ${port}...`);
});

