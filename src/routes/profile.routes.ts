import {Router, Request, Response, NextFunction} from 'express'
import { auth } from '../auth'

const profile = Router()

profile.get('/', auth, (req: Request, res: Response) => {
    res.json({message: 'Se mantiene la sesion'})
})

export default profile