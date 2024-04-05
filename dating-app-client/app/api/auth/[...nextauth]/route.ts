import { generateRandomPassword } from "@/app/_constants/constants";
import Endpoint from "@/app/_endpoint/endpoint";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile?.email) {
        throw new Error("No profile");
      }
      console.log(account);
      try {
        await fetch(Endpoint.registerByOAuth, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: profile?.email,
            password: generateRandomPassword(8),
            photoUrl: user?.image,
            knownAs: profile?.name,
          }),
        });
      } catch (error) {
        console.error("Error:", error);
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
