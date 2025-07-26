import config from "../config";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcrypt";

export const seedSuperAdmin = async () => {
  const superAdmin = await User.findOne({ email: config.SUPER_ADMIN_EMAIL });
  if (superAdmin) {
    console.log(`Super Admin Already Exists`);
    return;
  }
  const hashedPassword = await bcrypt.hash(
    config.SUPER_ADMIN_PASSWORD as string,
    Number(config.BCRYPT_SALT)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: config.SUPER_ADMIN_EMAIL as string,
  };

  const payload: Partial<IUser> = {
    name: "Samio Hasan",
    email: config.SUPER_ADMIN_EMAIL,
    password: hashedPassword,
    role: Role.SUPER_ADMIN,
    auths: [authProvider],
  };

  await User.create(payload);
  console.log("Super Admin Created");
};
