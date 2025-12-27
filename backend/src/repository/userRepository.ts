import { UserSignUpType } from '@itz____mmm/common';
import User from '../schema/user';
import crudRepository from './crudRepository';

const userRepository = {
  ...crudRepository<any>(User),
  signupUser: async (data: UserSignUpType) => {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
  },
  getUserByEmail: async (email: string) => {
    const user = await User.findOne({ email });
    return user;
  },
  getUserByUsername: async (username: string) => {
    const user = await User.findOne({ username }).select('-password');
    return user;
  },
  getUserByToken: async (token: string) => {
    const user = await User.findOne({ verificationToken: token });
    return user;
  }
};

export default userRepository;
