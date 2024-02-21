import { Request, Response, Router } from "express";

import { MongoClient } from "mongodb";

import { MONGODB_URI, SECRET } from '../utils/config'

import { LoginUser } from '../types/usertypes'

import jwt from 'jsonwebtoken'

const login = Router()
const uri = MONGODB_URI

const dbname = 'portfolio_api';
const dbcollection = 'user';

login.post('/', async (req: Request, res: Response) => {
    const client = new MongoClient(uri)

    const { email, password } = req.body

    const db = client.db(dbname)
    const collection = db.collection(dbcollection)

    const user = await collection.findOne<LoginUser>({ "email": email }, {projection:{"_id":0}})
    console.log(user);

    let passwordCorrect = user === null ? false : user.password === password ? true : false
    console.log(passwordCorrect);

    if (!(user && passwordCorrect)) {
        // Los datos de inicio de sesion son incorrectos
        res.status(401).json({ message: 'usuario o contrasena incorrectos' });
        console.log('Incorrecto');
    } else {
        // Los datos son correctos y se envía el token
        console.log('Validado');
        const token = jwt.sign({username: user.user}, SECRET, {
            expiresIn: "1h"
        });
        console.log(user);
        res.status(200).json({ message: 'Loggeado con exito', token, data: user.user })
    }
})

export default login
