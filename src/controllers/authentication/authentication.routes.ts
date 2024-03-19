import express, { Router } from 'express';

const AuthenticationRoutes: Router = express.Router();
AuthenticationRoutes.use(express.json());

AuthenticationRoutes.post('/login', (req, res)=> {    
    const requestData = req.body;
    res.setHeader('Content-Type', 'application/json');

    if(requestData.email && requestData.password){

        if(requestData.password === 'admin'){
            res
            .status(200)
            .json({ login: true })
        }
        else 
        res.status(401).json({ login: false })

    }
    else {
        res.sendStatus(400);
    }   
});

export { AuthenticationRoutes };
