import { DB } from "../db.ts";

const db = DB.getInstance();

export async function register(content:any) {
    let response = { status: 400, body: { sucess: false, message: "Bad request body"} }

    // check that the request content contain : username, pubRSA
    if(content.username && content.pubRSA){

        // check if the user already exist
        if(!db.checkUsernameAvailability(content.username)){
            let userToken = generateRandomString(27);
            db.register(content.username, content.pubRSA, userToken);
            response = { status: 200, body: { sucess: true, message: "register ok" } };
        } else {
            response = { status: 409, body: { sucess: false, message: "Username already exist"} };
        }

    }

    return response
}



function generateRandomString(length:number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}