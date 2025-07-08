const Joi = require("joi");

const emailValidation= Joi.object({
    from: Joi.string().email(),
    to: Joi.string().email(),
    interested_service: Joi.string(),
    company_name: Joi.string(),
    client_name: Joi.string()
});

module.exports={emailValidation};