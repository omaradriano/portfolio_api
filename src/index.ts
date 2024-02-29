import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'

// Routes
import signup from './routes/signup.routes'
import login from './routes/login.routes'
import profile from './routes/profile.routes'
import jwt from 'jsonwebtoken'

// Extraer variables de entorno
import { PORT } from '../src/utils/config'

import {SECRET} from './utils/config'

type WhiteList = Array<string>

const whiteList: WhiteList = ["http://127.0.0.1:3000", "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://www.omaradriano.me"]

try {
    const app = express()

    //Body parser para el cuerpo de las solicitudes con json
    app.use(bodyParser.json({
        limit: '500kb'
    }))

    // Uso de los headers para permitir peticiones de los sitios especificados (Esto es un middleware)
    app.use((req: Request, res: Response, next: NextFunction) => {
        const origin: string | undefined = req.headers.origin;
        if (origin && whiteList.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    app.post('/verifycredentials', (req: Request, res: Response) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                throw new Error();
            }
            const decoded: any = jwt.verify(token, SECRET);
            console.log("Decoded", decoded);
            res.status(200).json({data: decoded.data})
            // (req as CustomRequest).token = decoded;
        } catch (err) {
            res.status(401).json({message: 'Please authenticate', status: 401});
        }
    })

    // Rutas para el registro de los usuarios
    app.use('/signup', signup)

    // Rutas para el login
    app.use('/login', login)

    //Rutas para perfiles
    app.use('/profile', profile)

    app.listen(PORT, () => {
        console.log(`Running server on port ${PORT}`);
    })
} catch (error) {
    const err = (error as Error).message
    console.log(err);
}

