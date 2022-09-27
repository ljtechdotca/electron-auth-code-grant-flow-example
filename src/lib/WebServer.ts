import { EventEmitter } from "events";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";

export class WebServer extends EventEmitter {
  private _instance: Server | null;
  isRunning = false;
  port: number;

  constructor(port: number) {
    super();
    this.port = port;
    this._instance = createServer(this.handleTraffic.bind(this));
  }

  start() {
    try {
      console.log(`Attempting to listen on port ${this.port}`);
      this._instance.listen(this.port);
      this.isRunning = true;
    } catch (error) {
      console.error("Web server error ", error);
    }
  }

  stop(reason: string) {
    try {
      console.log(`Now closing port ${this.port} - ${reason}`);
      this._instance.close();
      this.isRunning = false;
    } catch (error) {
      console.error("Web server error ", error);
    }
  }

  handleTraffic(req: IncomingMessage, res: ServerResponse) {
    const body = "🥳 Success!";

    res.writeHead(200, {
      "Content-Length": body.length,
      "Content-Type": "text/html",
    });

    res.end(body);

    this.emit("redirected", req.url);
  }
}
