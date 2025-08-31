import { transporter } from "../config/mailConfig";
import { mailQueue } from "../queues/mailQueue";

mailQueue.process(async function(job:any){
    const emailData = job.data;
    console.log("email data",emailData)
    try{
        const mailResponse = await transporter.sendMail(emailData);
        console.log("mail response",mailResponse);
    }catch(error){
        console.log(error)
    }
})

