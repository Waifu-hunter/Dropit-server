import { DB } from "../db.ts";

const db = DB.getInstance();

export function loginCheck(content:any, nodeID: string | null) {
    let response = { status: 400, body: { sucess: false, message: "Bad request body"} }

    console.log('00')
    // check that the request content contain : username, authString
    if(content.username && content.authString && nodeID){
        // check if the username exist
        let user = db.getUserDataViaUSERNAME(content.username);
        console.log('01')

        if (user) {
            let userAuthString = db.getAuthString(content.username);
            if (userAuthString) {
                // check if userAuthString is the same that the one sended by the client
                if (userAuthString === content.authString) {

                    // user is logged in, now generate a new unique ID
                    let uniqueID = generateRandomString(15);
                    db.setUserID(content.username, uniqueID);
                    db.setActiveNode(content.username, nodeID);
                    response = { status: 200, body: { sucess: true, message: uniqueID} };

                } else {
                    response = { status: 401, body: { sucess: false, message: "AuthString not match"} };
                }
            } else {
                response = { status: 404, body: { sucess: false, message: "Internal server error"} };
            }
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