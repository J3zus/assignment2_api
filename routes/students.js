const express = require('express');
const ruta = express.Router();
const Joi = require('joi'); //Importa Joi


//route() --> Funciones GET, POST, PUT, DELETE

const stdents = [
    {
        id:1,
        nombre:'Juan',
        semestre:5,
        correo:'juan@gmail.com',
        carrera:'Ing.Sistemas'},
];

ruta.get('/', (req, res) =>{
    res.send(stdents);
});

//http://localhost:3000/api/students/2/sex='m'&name=''
ruta.get('/:id', (req, res)=>{
    //Devuelve el primer elemento del arreglo que cumpla con un predicado
    //parseInt hace el casteo a entero directamente
    let studentComp = existeEstudiante(req.params.id);

    if(!studentComp)
        res.status(404).send('El estudiante no se encuentra'); //Devuelve el estado HTTP

    res.send(studentComp);
});

//Tiene el mismo nombre que la petiicion GET
//Express hace la diferencia dependiendo del

//Mandaremos/manipularemos los datos mediante un JSON con un Middleware
ruta.post('/',(req, res)=>{
    //El objeto req tiene la propiedad body

    const {value, error} = validarEstudiante(req.body.nombre, req.body.semestre, req.body.correo, req.body.carrera);
    if(!error){
        const student = {
            id:stdents.length + 1,
            nombre:req.body.nombre,
            semestre:req.body.semestre,
            correo:req.body.correo,
            carrera:req.body.carrera
        };

        stdents.push(student);
        res.send(student);

    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

});

//Peticion PUT
//Metodo para actualizar informacion
//Recibe el id del usuario que se quiere modificar
//Utilizando un parametro en la ruta :id
ruta.put('/:id', (req, res) => {
    let student = existeEstudiante(req.params.id);
    if(!student){
        res.status(404).send('El estudiante no se encuentra'); //Devuelve el estado HTTP
    
        //En el body del request debe venir la informacion para hacer la actualizacion.
        return;
    }
    //Validar que el nombre cumpla con las condiciones.
    
    //El objeto req tiene la propiedad body
    const {value, error} = validarEstudiante(req.body.nombre, req.body.semestre, req.body.correo, req.body.carrera);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    //Actualiza el nombre del usuario
    student.nombre      = value.nombre;
    student.semestre    = value.semestre;
    student.correo      = value.correo;
    student.carrera     = value.carrera;

    res.send(student);

});

//Peticion DELETE
//Metodo para eliminar informacion
//Recibe el id del usuario que se quiere eliminar
//Utilizando un parametro en la ruta :id

ruta.delete('/:id', (req, res) => {
    const student = existeEstudiante(req.params.id);
    if(!student){
        res.status(404).send('El estudiante no se encuentra');
        return;
    }

    //Encontrar el indice del usuario dentro del arreglo
    //Devuelve el indice de la primera ocurrencia del elemento
    const index = stdents.indexOf(student);
    stdents.splice(index, 1); //Elimina el elemento del indice indicado
    res.send(student); //Responde con el usuario eliminado
});

function existeEstudiante(id){
    return (stdents.find(u => u.id === parseInt(id)));
}

function validarEstudiante(nom,sem,cor,carr){
    const schema = Joi.object({
        nombre:Joi.string().min(3).required(),
        semestre:Joi.number().required(),
        correo:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        carrera:Joi.string().min(3).required()
    });
    return (schema.validate({nombre:nom, semestre:sem, correo:cor, carrera:carr}));
}

module.exports = ruta; //Se exporta el objeto ruta