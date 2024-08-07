import prisma from "@/db/src/db";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "xyz@gmail.com"},
                password: {label: "Password", type: "password", placeholder: "*********"}
            },
            async authorize(credentials): Promise<any>{
                if (!credentials) {
                    throw new Error("No credentials provided");
                  }

                try{
                    // console.log("reached here")
                    const user = await prisma.user.findFirst({
                        where: {
                            email: credentials?.email
                        },
                        
                    });
                    if (!user) {
                        console.log("No user found with email:", credentials.email);
                        throw new Error("No user found");
                      }

                      if (!user.isVerified) {
                        console.log("User not verified:", credentials.email);
                        throw new Error("User is not verified");
                      }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Incorrect Password");
                    }
                    
                }catch(e: any){
                    throw new Error(e.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.userid = user.userid?.toString();
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.isVerified = user.isVerified;
                token.username = user.username;
            }
            
            return token
        },
        session: async ({session, token}) => {
            if(token){
                session.user.userid = token.userid;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username;
            }
            return session
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET_KEY
} satisfies NextAuthOptions;
