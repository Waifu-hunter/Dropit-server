import { DB } from "../db.ts";

const db = DB.getInstance();

export async function logout(content:any) {
    let response = { status: 400, body: { sucess: false, message: "Bad request body"} }

    // check that the request content contain : username
    if(content.username){
        // check if the username exist
        let user = db.getUserDataViaUSERNAME(content.username);

        if (user) {
            db.setUserID(user.username, undefined)
            db.setActiveNode(user.username, undefined)
            response = { status: 200, body: { sucess: true, message: "Logout success"} };
        } else {
            response = { status: 404, body: { sucess: false, message: "Username not found"} };
        }
    }

    return response
}