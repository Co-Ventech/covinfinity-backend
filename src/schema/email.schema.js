const { emailValidation } = require("../validators/email.validator")

const validateSendEmail= (req,res,next)=>{
    const {error} = emailValidation.validate(req.body);
    if(error){
        res.status(400).send({
            status: 400,
            message: error.message
        });
    }
    next()
}

module.exports={validateSendEmail}