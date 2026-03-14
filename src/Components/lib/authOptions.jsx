
import { loginUser } from "@/app/action/server/auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {

    providers: [
        CredentialsProvider({
       
            name: 'Credentials',
          
            credentials: {
                // username: { label: "Username", type: "text", placeholder: "jsmith" },
                // password: { label: "Password", type: "password" }
            },


            async authorize(credentials, req) {
                const user=await loginUser(credentials);
                return user;

                // console.log(credentials)

                // return null;
            }
        })

    ],
}