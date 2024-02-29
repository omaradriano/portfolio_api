import {Router, Request, Response} from 'express'
//Auth va a usarse entre solicitudes para asegurarnos de que aun existe una sesion activa en localStorage
import { auth } from '../auth'

const profile = Router()

profile.get('/', auth, (req: Request, res: Response) => {
    res.json({message: 'Se mantiene la sesion'})
})

export default profile