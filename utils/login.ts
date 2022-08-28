import { RSA } from "https://deno.land/x/god_crypto@v1.4.10/rsa.ts"
import { DB } from "../db.ts";

const db = DB.getInstance();

export async function login(content:any) {
    let response = { status: 400, body: { sucess: false, message: "Bad request body"} }

    // check that the request content contain : username
    if(content.username){
        // check if the username exist
        let user = db.getUserDataViaUSERNAME(content.username);

        if (user) {
            // now generate the tmp auth string
            let randomString = generateRandomString(15)
            db.setAuthString(user.username, randomString);

            // now encrypt the tmp auth string with the user's pubRSA key
            try {
                const pub = db.getPublicKey(user.username)
                if(pub){
                    const publicKey = RSA.parseKey(pub);
                    const cipher = await new RSA(publicKey).encrypt(randomString);
                    response = { status: 200, body: { sucess: true, message: cipher.hex()} };
                }
                
            } catch (_error) {}
        } else {
            response = { status: 404, body: { sucess: false, message: "Username not found"} };
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