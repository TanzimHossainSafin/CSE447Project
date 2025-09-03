import { Router } from 'express';
import { login } from '../controller/login';
import {register} from '../controller/register';
const userRouter = Router();
userRouter.post('/signup',register);
userRouter.post('/login',login);
export default userRouter;
