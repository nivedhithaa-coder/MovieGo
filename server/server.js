import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app=express();
const port=3000;

//Middleware

app.use(express.json())
app.use(cors())

//Api routes
app.get('/', (req,res)=>res.send('server is live!'))

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));
