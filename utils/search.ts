import { DB } from "../db.ts";

const db = DB.getInstance();

export async function search(content:any) {
    // check that the request content contain : username
    if(content.search){
        let res = db.searchUserViaUsername(content.search);
        return { status: 400, body: { sucess: true, message: "User list", users: res} }
    } else { 
        return { status: 400, body: { sucess: false, message: "Bad request body"} }
    }
}