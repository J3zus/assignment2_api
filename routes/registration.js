const express = require('express');
const ruta = express.Router();
const Joi = require('joi'); //Importa Joi

const Register = [{
    id:1,
    idAlumno:0,
    nombreAlumno:'',
    idCurso:0,
    nombreCurso:'',
},];

ruta.get('/', (req, res) =>{
    res.send(Register);
});

ruta.get('/:id', (req, res)=>{
    //Devuelve el primer elemento del arreglo que cumpla con un predicado
    //parseInt hace el casteo a entero directamente
    let CursesCom = existeCurso(req.params.id);

    if(!CursesCom)
        res.status(404).send('El curso o el alumno no se encuentra'); //Devuelve el estado HTTP

    res.send(CursesCom);
});



module.exports = ruta; //Se exporta el objeto ruta