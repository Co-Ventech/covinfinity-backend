const { transporter } = require("../config/email.config");

const sendEmailService = async (body) => {
    try {
        const AdminmailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: `syedzubairalam123@gmail.com`,
            subject: `A client has approached to Co-VenTech`,
            html: `<h1>A client has approached to Co-VenTech</h1>
            ${body.client_name ? (

                    `<h2>Name</h2>
                    <p>${body.client_name}</h2>
`                ) : ''
                }

            ${body.from ? (

                    `<h2>Email</h2>
                    <p>${body.from}</h2>
    `
                ) : ''
                }

            ${body.company_name ? (

                    `         <h2>About Company</h2>
                    <p>${body.company_name}</p>
    `
                ) : ''
                }
            <h2>Interested Service</h2>
            <p>${body.interested_service}</p>
                   `,
        };

        await transporter.sendMail(AdminmailOptions);
        return {
            status: 200,
            message: "Your message has been sent successfully"
        }
    } catch (e) {
        console.log(e)
        return {
            status: 500,
            message: e.message
        }
    }
}

module.exports = { sendEmailService }