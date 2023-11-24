import nodemailer from 'nodemailer';
export const SendEmail=async (to,subject,text)=>{
const transpoter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_ID,
        pass:process.env.EMAIL_PASSWORD
    }
})
const info=await transpoter.sendMail({
    from:process.env.EMAIL_ID,
    to,
    subject,
    text
});
console.log('message send',info)
}