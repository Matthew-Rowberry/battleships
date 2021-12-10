import { ISubscribers, Message } from '../types';

class BattleshipClient {
  private socket: WebSocket;
  private subscribers: ISubscribers;
  private requests: Record<
    number,
    { rs: (message: Message) => void; rj: (message: Message) => void }
  >;
  private requestId: number;

  constructor(socket: WebSocket) {
    this.requestId = 1;
    this.socket = socket;
    this.socket.onmessage = this.handleMessage;
    this.subscribers = {};
    this.requests = {};
  }

  public async send(message: Record<string, unknown>): Promise<unknown> {
    await this.socket.send(
      JSON.stringify({
        ...message,
        ref: this.requestId,
      })
    );

    const promise = new Promise<Message>((resolve, reject) => {
      this.requests[this.requestId] = { rs: resolve, rj: reject };
    });

    this.requestId++;

    return promise;
  }

  public subscribe(message: string, callback: () => void) {
    // If this message hasnt been subscribed before add in new list
    if (!this.subscribers[message]) {
      this.subscribers[message] = [];
    }

    // Add callback to list
    this.subscribers[message].push(callback);
  }

  public unsubscribe(message: string, callback: () => void) {
    this.subscribers[message] = this.subscribers[message].filter(
      (cb) => cb !== callback
    );
  }

  private handleMessage = (plainMessage: MessageEvent<any>): void => {
    const message = JSON.parse(plainMessage.data);

    // Alert subscribers that subscribed with type `message.type`
    if (this.subscribers[message.type]) {
      for (const subscriber of this.subscribers[message.type]) {
        subscriber(message.payload);
      }
    }

    // Resolve any callers who used send()
    if (message.ref) {
      if (message.type === 'ACK') {
        this.requests[message.ref].rs(message);
      }

      if (message.type === 'ERROR') {
        this.requests[message.ref].rj(message);
      }

      delete this.requests[message.ref];
    }
  };
}

const ws = new WebSocket('ws://localhost:8080');
// TODO: we should wait for the websocket to be connected fully before anything else

export default new BattleshipClient(ws);
