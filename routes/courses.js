const express = require('express');
const ruta = express.Router();
const Joi = require('joi'); //Importa Joi

//route() --> Funciones GET, POST, PUT, DELETE

const Courses = [
    {
        id:1,
        nombre:'Js pro',
        creditos:6,
        carrera:'Ing.Sistemas',
    },
];

ruta.get('/', (req, res) =>{
    res.send(Courses);
});


/*                             =============
================================ Insertar  ===========================
                               =============
*/

ruta.get('/:id', (req, res)=>{
    //Devuelve el primer elemento del arreglo que cumpla con un predicado
    //parseInt hace el casteo a entero directamente
    let CursesCom = existeCurso(req.params.id);

    if(!CursesCom)
        res.status(404).send('El curso no se encuentra'); //Devuelve el estado HTTP

    res.send(CursesCom);
});

//Mandaremos/manipularemos los datos mediante un JSON con un Middleware
ruta.post('/',(req, res)=>{
    //El objeto req tiene la propiedad body

    const {value, error} = validarCurso(req.body.nombre, req.body.creditos, req.body.carrera);
    if(!error){
        const curse = {
            id:Courses.length + 1,
            nombre:req.body.nombre,
            creditos:req.body.creditos,
            carrera:req.body.carrera
        };

        Courses.push(curse);
        res.send(curse);

    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

});

//Peticion PUT
//Metodo para actualizar informacion
//Recibe el id del curso que se quiere modificar
//Utilizando un parametro en la ruta :id
ruta.put('/:id', (req, res) => {
    let curses = existeCurso(req.params.id);
    if(!curses){
        res.status(404).send('El curso no se encuentra'); //Devuelve el estado HTTP
    
        //En el body del request debe venir la informacion para hacer la actualizacion.
        return;
    }

    //Validar que el nombre cumpla con las condiciones.
    //El objeto req tiene la propiedad body

    const {value, error} = validarCurso(req.body.nombre, req.body.creditos, req.body.carrera);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    //Actualiza el los campos (nombre, creditos, carrera) del curso
    curses.nombre      = value.nombre;
    curses.creditos    = value.creditos;
    curses.carrera     = value.carrera;

    res.send(curses);

});

//Peticion DELETE
//Metodo para eliminar informacion
//Recibe el id del curso que se quiere eliminar
//Utilizando un parametro en la ruta :id

ruta.delete('/:id', (req, res) => {
    const curse = existeCurso(req.params.id);
    if(!curse){
        res.status(404).send('El curso no se encuentra');
        return;
    }

    //Encontrar el indice del curso dentro del arreglo
    //Devuelve el indice de la primera ocurrencia del elemento
    const index = Courses.indexOf(curse);
    Courses.splice(index, 1); //Elimina el elemento del indice indicado
    res.send(curse); //Responde con el usuario eliminado
});

function existeCurso(id){
    return (Courses.find(u => u.id === parseInt(id)));
}

function validarCurso(nom,cre,carr){
    const schema = Joi.object({
        nombre:Joi.string().min(3).required(),
        creditos:Joi.number().required(),
        carrera:Joi.string().min(3).required()
    });
    return (schema.validate({nombre:nom, creditos:cre,  carrera:carr}));
}

module.exports = ruta; //Se exporta el objeto ruta