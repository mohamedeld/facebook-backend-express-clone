const nodemailer = require("nodemailer");
const  {google} = require("googleapis");


const { OAuth2} = google.auth;

const oauthLink = "https://developers.google.com/oauthplayground"

const {SENDER_EMAIL_ADDRESS,MAILING_SERVICE_CLIENT_ID,MAILING_SERVICE_CLIENT_SECRET,MAILING_SERVICE_CLIENT_REFRESH_TOKEN} = process.env;

const auth = new OAuth2(MAILING_SERVICE_CLIENT_ID,MAILING_SERVICE_CLIENT_REFRESH_TOKEN,MAILING_SERVICE_CLIENT_SECRET,
    oauthLink
)

exports.sendVerificationEmail = (email,name,url)=>{
    auth.setCredentials({
        refresh_token:MAILING_SERVICE_CLIENT_REFRESH_TOKEN
    });
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
        service:'gmail',
        auth:{
            type:'OAuth2',
            user:SENDER_EMAIL_ADDRESS,
            clientId:MAILING_SERVICE_CLIENT_ID,
            clientSecret:MAILING_SERVICE_CLIENT_SECRET,
            refreshToken:MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
            accessToken
        }
    });
    const mailOptions = {
        from:SENDER_EMAIL_ADDRESS,
        to:email,
        subject:"Notebook email verification",
        html:` <div style="max-width: 700px; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px; font-weight: 600; color: #3b5998;">
        <img src="./assets/images/facebook.png" alt="facebook icon" style="width: 30px; height: 30px; object-fit: cover;">
        <span>Action required: Activate your notebook account</span>
    </div>
    <div style="padding: 1rem 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; color: #141823;">
        <span>Hello ${name}</span>
        <div style="padding: 1rem;">
            <span style="padding: 1.5rem 0; display: inline-block;">you recently created an account on notebook to complete your registration please confirm your account.</span>
        </div>
        <a href=${url} style="display: inline-block; padding: 10px 15px; background-color: #4c639b; color: white; text-decoration: none; font-weight: 600;">Confirm your account</a>
    </div>`
    }
    stmp.sendMail(mailOptions,(err,res)=>{
        if(err){
            return err
        }
        return res;
    })
}