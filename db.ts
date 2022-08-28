// this is a singleton class

interface User {
    username: string,
    token: string,
    activeNode: string | undefined,
    authString: string | undefined,
    id: string | undefined | null
}


Deno.mkdirSync("./rsa", { recursive: true });

export class DB {
    private static instance: DB;

    private db: User[] = [];

    private constructor() {
        try {
            this.db = JSON.parse(Deno.readTextFileSync("./users.json"));
        } catch (error) {}
        setInterval(() => {
            Deno.writeTextFileSync("./users.json", JSON.stringify(this.db));
        } , 10000);
    }

    public static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    public checkUsernameAvailability(username: string) {
        return this.db.some(user => user.username == username);
    }

    public register(username: string, pubRSA: string, token: string) {
        Deno.writeTextFileSync("./rsa/"+token+"_pub.pem", pubRSA);
        this.db.push({ 
            username:username,
            token: token, 
            activeNode: undefined,
            authString: undefined,
            id: undefined
        });
    }

    public setAuthString(username: string, authString: string | undefined) {
        let user = this.getUserDataViaUSERNAME(username);
        if(user){
            user.authString = authString;
        }
    }

    public getAuthString(username: string) {
        let user = this.getUserDataViaUSERNAME(username);
        if(user){
            return user.authString;
        }
        return undefined;
    }

    public setUserID(username: string, id: string | undefined) {
        let user = this.getUserDataViaUSERNAME(username);
        if(user){
            user.id = id;
        }
    }

    public setActiveNode(username: string, node: string | undefined) {
        let user = this.getUserDataViaUSERNAME(username);
        if(user){
            user.activeNode = node;
        }
    }

    public getUserDataViaUSERNAME(username: string) {
        return this.db.find(user => user.username == username);
    }

    public getUserDataViaID(id: string) {
        return this.db.find(user => user.id == id);
    }

    public searchUserViaUsername(username: string) {
        let t = this.db.filter(user => user.username.includes(username));
        // only keep the 20 first result
        return t.slice(0, 20);
    }
    
    public getActiveNode(username: string) {
        let user = this.getUserDataViaUSERNAME(username);
        if(user){
            return user.activeNode;
        }
        return undefined;
    }


    public getPublicKey(username: string) {
        let user = this.getUserDataViaUSERNAME(username);
        if(user){
            return Deno.readTextFileSync("./rsa/"+user.token+"_pub.pem");
        }
        return undefined;
    }

}














