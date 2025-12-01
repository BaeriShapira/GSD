import { getHelloMessage } from "../services/hello.service.js";

export function helloText(req, res) {
    res.send("Hello from controller");
}

export function helloJson(req, res) {
    const data = getHelloMessage();
    res.json(data);
}
