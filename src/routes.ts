import { Router } from "express";
import { SurveysController } from './controllers/SurveysController';
import { UserController } from './controllers/UserController';
import { SendMailController } from "./controllers/SendMailController";
import AnswerController from "./controllers/AnswerController";
import NpsController from "./controllers/NpsController";




const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();

const sendMailController = new SendMailController()

router.post("/users", userController.create);

router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);

router.post("/send_mail", sendMailController.execute)

router.get('/answers/:value', AnswerController.execute);

router.get('/nps/:survey_id', NpsController.execute);

export { router }




