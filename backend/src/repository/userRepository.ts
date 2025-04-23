import User from '../schema/user';
import crudRepository from './crudRepository';

const userRepository = {
  ...crudRepository<any>(User),
  getUserByEmail: async (email: string) => {
    const user = await User.findOne({ email });
    return user;
  },
  getUserByUsername: async (username: string) => {
    const user = await User.findOne({ username }).select('-password');
    return user;
  }
};

export default userRepository;
