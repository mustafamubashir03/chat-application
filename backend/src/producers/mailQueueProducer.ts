import { mailQueue } from '../queues/mailQueue.js';
import '../processors/mainProcessor.js';

export const addEmailtoMailQueue = async (emailData: any) => {
  try {
    await mailQueue.add(emailData);
    console.log('Email added to mail queue');
  } catch (error) {
    console.log('Add email to mail queue error', error);
  }
};
