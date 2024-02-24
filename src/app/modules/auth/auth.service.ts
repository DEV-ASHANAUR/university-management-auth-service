/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { Admin } from '../admin/admin.model';
import { Faculty } from '../faculty/faculty.model';
import { Student } from '../student/student.model';
import { sendEMail } from './sendResetMail';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const isUserExist = await User.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User dose not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'password is incorrect');
  }

  //create access token & refresh token

  const { id: userId, role, needsPasswordChange } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ id: user?.userId }).select(
    '+password'
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  isUserExist.password = newPassword;
  isUserExist.needsPasswordChange = false;

  //updating using save();
  isUserExist.save();
};

const forgotPass = async (payload: { id: string }) => {
  const user: any = await User.findOne({ id: payload.id }, { id: 1, role: 1 });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  let profile = null;
  if (user.role === ENUM_USER_ROLE.ADMIN) {
    profile = await Admin.findOne({ id: user.id });
  } else if (user.role === ENUM_USER_ROLE.FACULTY) {
    profile = await Faculty.findOne({ id: user.id });
  } else if (user.role === ENUM_USER_ROLE.STUDENT) {
    profile = await Student.findOne({ id: user.id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile not Found');
  }

  const passResetToken = await jwtHelpers.createResetToken(
    { id: user.id },
    config.jwt.secret as string,
    '50m'
  );

  const resetLink: string =
    config.resetlink + `id=${user.id}&token=${passResetToken}`;

  await sendEMail(
    profile.email,
    `
      <div>
        <p>Hi, ${profile.name.firstName}</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `
  );
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const { id, newPassword } = payload;
  const user = await User.findOne({ id }, { id: 1 });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }
  const isVarified = await jwtHelpers.verifyToken(
    token,
    config.jwt.secret as string
  );

  if (!isVarified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invaild reset password token!');
  }

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bycript_salt_rounds)
  );
  await User.updateOne({ id }, { password });
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPass,
  resetPassword,
};
