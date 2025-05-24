"use server";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/app/db";
import { userModel } from "@/models/UserModel";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "",
  callbacks: {
    signIn: async ({ user }) => {
      try {
        await dbConnect();

        if (!user.email) return false;

        const userExists = await userModel.findOne({ email: user.email });
        if (!userExists) {
          await userModel.create({
            name: user.name || "Unnamed",
            email: user.email,
          });
        }

        return true;
      } catch (err) {
        console.error("SignIn Error:", err);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
