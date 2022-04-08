const express = require('express');
const ruta = express.Router();
const Joi = require('joi'); //Importa Joi

const Courses = require('./courses.js');

const Register = [{
    id: 1,
    idAlumno: 0,
    nombreAlumno: '',
    idCurso: 0,
    nombreCurso: '',
}, ];

ruta.get('/', (req, res) => {
    res.send(Courses);
});

ruta.get('/:id', (req, res) => {
    //Devuelve el primer elemento del arreglo que cumpla con un predicado
    //parseInt hace el casteo a entero directamente
    let CursesReg = existeRegistro(req.params.id);

    if (!CursesReg)
        res.status(404).send('El registro no se encuentra'); //Devuelve el estado HTTP

    res.send(CursesReg);
});



//Mandaremos/manipularemos los datos mediante un JSON con un Middleware
ruta.post('/', (req, res) => {
    //El objeto req tiene la propiedad body

    const { value, error } = validarReg(req.body.idAlumno, req.body.idCurso);
    if (!error) {
        const cursereg = {
            id: Register.length + 1,
            nombre: req.body.nombre,
            creditos: req.body.creditos,
            carrera: req.body.carrera
        };

        Register.push(cursereg);
        res.send(cursereg);

    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

});

function validarReg(nom, cre, carr) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
        creditos: Joi.number().required(),
        carrera: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nom, creditos: cre, carrera: carr }));
}

function existeRegistro(id) {
    return (Courses.find(u => u.id === parseInt(id)));
}




module.exports = ruta; //Se exporta el objeto ruta