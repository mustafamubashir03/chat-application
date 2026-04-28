import { transporter } from '../config/mailConfig.js';
import { mailQueue } from '../queues/mailQueue.js';

mailQueue.process(async function (job: any) {
  const emailData = job.data;
  console.log('email data', emailData);
  try {
    const mailResponse = await transporter.sendMail(emailData);
    console.log('mail response', mailResponse);
  } catch (error) {
    console.log('error occured');
  }
});
