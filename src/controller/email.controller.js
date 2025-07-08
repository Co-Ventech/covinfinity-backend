const emailService= require('../service/email.service')

const sendEmailController= async(req,res)=>{
    try{
        const result= await emailService.sendEmailService(req.body);
        res.send({
            status: result.status,
            message: result.message
        })

    }catch(e){
        res.status(500)
        .send({
            status:500,
            message: e.message
        })
    }
}

module.exports= {sendEmailController}