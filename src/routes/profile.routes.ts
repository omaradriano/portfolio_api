import {Router, Request, Response, NextFunction} from 'express'

const profile = Router()

profile.get('/', (req: Request, res: Response) => {

    console.log('Se ha entrado a profile');
    res.send('ola')
})

export default profile