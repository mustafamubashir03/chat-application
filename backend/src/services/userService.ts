import { UserCreateType } from '@itz____mmm/common';

import userRepository from '../repository/userRepository';

export const signupService = (data: UserCreateType) => {
  try {
    const newUser = userRepository.createDoc(data);
    return newUser;
  } catch (error) {
    console.log('user service error', error);
  }
};
