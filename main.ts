/**
 * 
 * Serveur d'authentification.
 * Permet de se connecter à l'application via une clé d'authentification.
 * 
 * 2 tables de données: 
 * - une table de clés d'authentification
 *      - RSA clé publique
 *      - user key
 * - table des currents user connected
 *      - id user
 *      - node infos
 * 
 */
import { register } from "./utils/register.ts";
import { login } from "./utils/login.ts";
import { loginCheck } from "./utils/loginCheck.ts";
import { logout } from "./utils/logout.ts";
import { search } from "./utils/search.ts";
import { whereIs } from "./utils/whereIs.ts";

const RESPONSE_ERROR = new Response("I'm a teapot", { status: 418 });

const server = Deno.listen({ port: 25790, hostname: "127.0.0.1" });

async function main(request: Request) {
    if (request.method != "POST") {
        return { status: 405, body: "Method not allowed" };
    }

    const content = await request.json(),
        path = new URL(request.url).pathname;

    console.log(content);


    if(path == "/register"){
        return register(content);
    } else if(path == "/login"){
        return login(content);
    } else if(path == "/loginCheck"){
        console.log("loginCheck")
        return loginCheck(content, request.headers.get("nodeID"));
    } else if(path == "/logout"){
        return logout(content);
    } else if(path == "/search"){
        return search(content);
    } else if(path == "/whereIs"){
        return whereIs(content);
    }

    return { status: 404, body: "Not found" };
}

console.log("Server started");
for await (const conn of server) {
    (async () => {
        const httpConn = Deno.serveHttp(conn);
        for await (const { request, respondWith } of httpConn) {
            if (["GET", "POST"].includes(request.method)) {
                const { status, body } = await main(request),
                    content = typeof body == "string" ? body : JSON.stringify(body);

                respondWith(new Response(content, { status }));
            } else {
                respondWith(RESPONSE_ERROR);
            }
        }
    })();
}