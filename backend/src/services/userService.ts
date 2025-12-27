import { UserSignInType, UserSignUpType } from '@itz____mmm/common';

import userRepository from '../repository/userRepository';
import { APP_URL, ENABLE_EMAIL_VERIFICATION } from '../config/serverConfig';
import { addEmailtoMailQueue } from '../producers/mailQueueProducer';
import mailObject from '../utils/mailObject';
import { ClientError } from '../utils/ObjectResponse';
import { StatusCodes } from 'http-status-codes';

export const signupService = async (data: UserSignUpType) => {
  try {
    const userExists = await userRepository.getUserByEmail(data.email);
    if (userExists) {
      throw new ClientError({
        explanation: 'Invalid data from the client',
        message: 'User already exists',
        status: StatusCodes.BAD_REQUEST
      });
    }
    const newUser = await userRepository.signupUser(data);
    if (ENABLE_EMAIL_VERIFICATION) {
      // Ensure HTTP protocol for localhost to avoid SSL errors
      const verificationUrl = APP_URL.replace(
        /^https:\/\/(localhost|127\.0\.0\.1)/i,
        'http://$1'
      );
      await addEmailtoMailQueue({
        ...mailObject,
        to: newUser.email,
        subject: 'Welcome to the app.Please verify your email',
        text: `Welcome to the app. Please verify your email by clicking on the link below:${verificationUrl}/verify/${newUser.verificationToken}`
      });
    }
    return newUser;
  } catch (error: any) {
    console.log('user signup service error', error);
    // Re-throw error so it can be handled by the controller
    throw error;
  }
};

export const verifyTokenService = async (token: string) => {
  try {
    const user = await userRepository.getUserByToken(token);
    if (!user) {
      throw new ClientError({
        explanation: 'Invalid data from the client',
        message: 'Incorrect verification token',
        status: StatusCodes.BAD_REQUEST
      });
    }
    // Check if user is already verified
    if (user.isVerified) {
      throw new ClientError({
        explanation: 'Invalid data from the client',
        message: 'Email is already verified',
        status: StatusCodes.BAD_REQUEST
      });
    }
    // Check if token has expired
    if (
      user.verificationTokenExpiry &&
      user.verificationTokenExpiry < Date.now()
    ) {
      throw new ClientError({
        explanation: 'Invalid data from the client',
        message: 'Verification token has expired',
        status: StatusCodes.BAD_REQUEST
      });
    }
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();
    return user;
  } catch (error) {
    console.log('verification token error', error);
    // Re-throw error so it can be handled by the controller
    throw error;
  }
};

export const signinService = async (data: UserSignInType) => {
  try {
    const userFound = await userRepository.getUserByEmail(data.email);
    return userFound;
  } catch (error) {
    console.log('user signin service error', error);
  }
};
