import { User, getServerSession } from "next-auth";

export const getUserSession = async (): Promise<User> => {
  const authUserSession = await getServerSession();
  return { ...(authUserSession?.user as User) };
};
