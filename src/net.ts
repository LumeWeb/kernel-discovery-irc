import { Duplex, Callback } from "streamx";
interface SocketOptions {
  allowHalfOpen?: boolean;
  remoteAddress?: string;
  remotePort?: number;
  cb?: Function;
}

export default class Socket extends Duplex {
  private _ws: WebSocket;

  constructor({ remoteAddress, remotePort, cb }: SocketOptions = {}) {
    super();
    this._ws = new WebSocket(`wss://${remoteAddress}/webirc`);

    ["message", "end", "close", "error"].forEach((event) => {
      this._ws.addEventListener(event, (...args) => {
        let sendEvent = event;
        let sendData = args;

        if (event === "message") {
          sendEvent = "data";
          sendData[0] = (args[0] as MessageEvent).data + "\n" as any;
        }
        // @ts-ignore
        return this.emit(sendEvent, ...sendData);
      });
      this._ws.addEventListener("open", cb as any);
    });
  }
  _write(data: any, cb: Callback) {
    this._ws.send(data);
    cb();
  }
  setEncoding() {}
}
export function connect(
  port: number,
  host: string,
  opts = {},
  cb: Function
): Socket {
  return new Socket({
    remotePort: port,
    remoteAddress: host,
    cb,
  });
}
