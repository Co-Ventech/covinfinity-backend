const Joi = require("joi");

const emailValidation= Joi.object({
    from: Joi.string().email().optional(),
    to: Joi.string().email(),
    interested_service: Joi.string(),
    company_name: Joi.string().optional(),
    client_name: Joi.string().optional()
});

module.exports={emailValidation};