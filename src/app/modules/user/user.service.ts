import config from '../../../config';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';

const createUser = async (user: IUser): Promise<IUser | null> => {
  // auto generated incremental id
  const id = await generateUserId();
  user.id = id;
  //default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }
  //create user
  const createdUser = await User.create(user);

  //if any error is occure while create user
  if (!createdUser) {
    throw new Error('Failed to create user!');
  }
  //return user
  return createdUser;
};

export const UserService = {
  createUser,
};
