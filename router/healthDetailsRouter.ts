import { Router } from "express";
import { addHabit  } from "../controller/addHabit";
import { isLogin } from "../middleware/isLogin";
import { deleteHabit } from "../controller/deleteHabit";
import { getHabits, getAllUsersHabits } from "../controller/getAllHabits";
import { getMyActivities } from "../controller/getMyActivities";
const healthDetailsRouter = Router();

healthDetailsRouter.post('/addhabit',isLogin,addHabit );
healthDetailsRouter.delete('/delete',isLogin,deleteHabit);
healthDetailsRouter.get('/habits',isLogin,getHabits);
healthDetailsRouter.get('/allhabits',isLogin,getAllUsersHabits);
healthDetailsRouter.get('/myactivities',isLogin,getMyActivities);
export default healthDetailsRouter;    