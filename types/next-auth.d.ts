import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth'{
    interface User{
        userid?: string, 
        username?: string,
        isVerified?: boolean,
        isAcceptingMessage?: boolean
    }

    interface Session{
        user: {
        userid?: string, 
        username?: string,
        isVerified?: boolean,
        isAcceptingMessage?: boolean
        } & DefaultSession['user']
    }

}

declare module 'next-auth/jwt'{
    interface JWT {
        userid?: string, 
        username?: string,
        isVerified?: boolean,
        isAcceptingMessage?: boolean
    }
}