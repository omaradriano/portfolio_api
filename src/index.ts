import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
// import cors from 'cors'

// Routes
import signup from './routes/signup.routes'
import login from './routes/login.routes'

import {PORT} from '../src/utils/config'

type WhiteList = Array<string>

const whiteList: WhiteList = ["http://127.0.0.1:3000", "http://localhost:3000"]


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

    // Rutas para el registro de los usuarios
    app.use(signup)

    // Rutas para el login
    app.use(login)

    app.listen(PORT, () => {
        console.log(`Running server on port ${PORT}`);
    })
} catch (error) {
    const err = (error as Error).message
    console.log(err);
}

