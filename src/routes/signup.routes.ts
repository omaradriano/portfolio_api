import { Request, Response, Router } from "express";
import { MongoClient } from "mongodb";

const signup = Router()
const uri = 'mongodb://127.0.0.1:27017/portfolio_api'

const dbname = 'portfolio_api';
const dbcollection = 'user';

// profile.get('/profile/:username', async (request, response) => {
//     const mongo = await MongoClient.connect(uri)
//     await mongo.connect()

//     const { username } = request.params

//     const BDD = mongo.db('portfolio_api');
//     const coleccion = BDD.collection('user');

//     // Insertar el documento en la colección
//     const resultado = await coleccion.find({ "name": username }).toArray();

//     response.send(resultado[0].name)
//     console.log(resultado[0].name)
//     await mongo.close()
// })


// Agregar un usuario

interface UserData {
    user: string
    email: string
    password: string
}

signup.post('/signup', async (req: Request, res: Response) => {
    const client = await MongoClient.connect(uri)
    const { user, email, password }: UserData = req.body
    try {
        const db = client.db(dbname)
        const collection = db.collection(dbcollection)

        const ifUserExists = await collection.findOne({ "user": user }).then(res => res)
        if (ifUserExists){
            console.log('Usuario ya existe');
            return res.status(400).json({ message: 'El usuario ya existe', status: 400 })
        } 

        const ifEmailExists = await collection.findOne({ "email": email }).then(res => res)
        if (ifEmailExists){
            console.log('Correo electronico ya registrado');
            return res.status(400).json({ message: 'Ya existe un correo registrado', status: 400 })
        } 

        const data: UserData = {
            user, email, password
        }

        const result = await collection.insertOne(data);
        console.log('Documento insertado con ID:', result.insertedId);

        res.status(200).json({ message: 'Usuario registrado con exito', status: 200 })

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json({ message: 'Error interno del servidor', status: 500 });
    } finally {
        client.close();
    }
})




export default signup

