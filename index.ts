import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './router/userRouter';
import healthDetailsRouter from './router/healthDetailsRouter';
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Hello World')
});
app.use('/app/v1/users',userRouter);
app.use('/app/v1/health',healthDetailsRouter);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});