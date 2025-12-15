import { UserSignInType, UserSignUpType } from '@itz____mmm/common';

import userRepository from '../repository/userRepository';

export const signupService = (data: UserSignUpType) => {
  try {
    const newUser = userRepository.createDoc(data);
    return newUser;
  } catch (error: any) {
    console.log('user signup service error', error);
  }
};

export const signinService = (data: UserSignInType) => {
  try {
    const userFound = userRepository.getUserByEmail(data.email);
    return userFound;
  } catch (error) {
    console.log('user signin service error', error);
  }
};
