import { Request, Response, Router } from "express";
import { MongoClient } from "mongodb";
import { MONGODB_URI } from '../utils/config'

import bcrypt from 'bcrypt'
const saltRounds = 10

const signup = Router()
const uri = MONGODB_URI

const dbname = 'portfolio';
const dbcollection = 'users';

import { UserData } from '../types/usertypes'

//Saves a new user in the database
signup.post('/', async (req: Request, res: Response) => {
    const client = new MongoClient(uri)
    const { user, email, password }: UserData = req.body
    try {
        const db = client.db(dbname)
        const collection = db.collection<UserData>(dbcollection)

        const ifUserExists = await collection.findOne({ "user": user }).then(res => res)
        if (ifUserExists) {
            return res.status(400).json({ message: 'El usuario ya existe', status: 400 })
        }

        const ifEmailExists = await collection.findOne({ "email": email }).then(res => res)
        if (ifEmailExists) {
            return res.status(400).json({ message: 'Ya existe un correo registrado', status: 400 })
        }

        let hashedPass = await bcrypt.hash(password, saltRounds)

        const data: UserData = {
            user, email, password: hashedPass
        }

        const result = await collection.insertOne(data);
        console.log('Documento insertado con ID:', result.insertedId);

        res.status(200).json({ message: 'Usuario registrado con exito', status: 200 })

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json({ message: 'Error interno del servidor', status: 500 });
    } finally {
        await client.close();
    }
})




export default signup

