import { Router } from "express";
import { UserController } from './controllers/UserController';
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from "./controllers/SendMailController";
import NpsController from "./controllers/NpsController";
import AnswerController from "./controllers/AnswerController";

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




