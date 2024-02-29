import { Request, Response, Router } from "express";

import { MongoClient } from "mongodb";

//Import environmet variables
import { MONGODB_URI, SECRET } from '../utils/config'

import { LoginUser } from '../types/usertypes'

//Using jwt and encrypt pass
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const login = Router()
const uri = MONGODB_URI

const dbname = 'portfolio_api';
const dbcollection = 'user';

login.post('/', async (req: Request, res: Response) => {
    const client = new MongoClient(uri)
    const db = client.db(dbname)
    const collection = db.collection(dbcollection)

    try {
        const { email, password } = req.body

        if(email.length === 0 || password.length === 0) throw new Error('No hay informacion suficiente para el registro')
        
        const user = await collection.findOne<LoginUser>({ "email": email }, { projection: { "_id": 0, "email": 1, "user": 1, "password": 1 } })
        console.log("user data", user);

        if (!user) throw new Error('No hay datos del usuario')

        let decryptedPass = await bcrypt.compare(password, user.password)

        if (!(user && decryptedPass)) {
            // Los datos de inicio de sesion son incorrectos
            res.status(401).json({ message: 'usuario o contrasena incorrectos' });
        } else {
            // Los datos son correctos y se envía el token
            let userdata = {
                user: user.user,
            }
            const token = jwt.sign({ data: { ...userdata } }, SECRET, {
                expiresIn: "1h"
            });
            console.log(user);
            res.status(200).json({ message: 'Loggeado con exito', token, ...userdata })
        }
    } catch (error) {
        let err = error as Error
        console.log(err.message);
        res.status(401).json({mesagge: err.message, status: 401})
    }
})

export default login
