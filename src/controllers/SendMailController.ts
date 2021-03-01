import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from "path";

import SendMailService from "../services/SendMailService";

import { UserRepository } from '../repositories/UsersRepository';
import { SurveyUserRepository } from "../repositories/SurveysUsersRepository";
import { SurveysRepository } from '../repositories/SurveysRepository';

class SendMailController {
    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body

        const usersRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveysRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const user = await usersRepository.findOne({ email })

        if(!user){
            return response.status(400).json({
                error: "User does not exists"
            })
        }

        const survey = await surveyRepository.findOne({id: survey_id})
        if(!survey){
            return response.status(400).json({
                error: "Survey does not exists"
            })
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"],
        })

        const variables = {
            name: user.id,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        }

        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return response.json(surveyUserAlreadyExists)
        }

        // salvar informacoes na tabela survey_user
        const surveyUser = SurveyUserRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveyUserRepository.save(surveyUser)

        variables.id = surveyUser.id

        // enviar email para o usuario
        await SendMailService.execute(email, survey.title, variables, npsPath)

        return response.json(surveyUser)
    }
}
export {SendMailController}