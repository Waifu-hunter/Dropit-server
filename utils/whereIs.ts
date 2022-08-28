import { DB } from "../db.ts";

const db = DB.getInstance();

export async function whereIs(content:any) {
    let response = { status: 400, body: { sucess: false, message: "Bad request body", userInfo: {}} }

    // check that the request content contain : userID
    if(content.userID){
        // check if the username exist
        let user = db.getUserDataViaID(content.userID);

        if (user) {
            let obj = {
                online: db.getActiveNode(user.username) !== undefined,
                node: db.getActiveNode(user.username),
                id: user.id,
            }
            response = { status: 200, body: { sucess: true, message: "User success", userInfo: obj} };
        } else {
            response = { status: 404, body: { sucess: false, message: "Username not found", userInfo: {}} };
        }
    }

    return response
}