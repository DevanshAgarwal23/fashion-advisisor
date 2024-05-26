import { getServerSession } from "next-auth";
import {authOptions} from "./auth"

export async function getCurrentSesssion(){

    const session = await getServerSession(authOptions);
    return session;
}