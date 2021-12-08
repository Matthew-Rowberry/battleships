interface ISubscribers {
  [key: string]: ((value: unknown) => void)[];
}
class BattleshipClient {
  private socket: WebSocket;
  private subscribers: ISubscribers;
  private requests: Record<number, { rs: () => void; rj: () => void }>;
  private requestId: number;

  constructor(socket: WebSocket) {
    this.requestId = 0;
    this.socket = socket;
    this.socket.onmessage = this.handleMessage;
    this.subscribers = {};
    this.requests = {};
  }

  public async send(message: object): Promise<unknown> {
    this.socket.send(
      JSON.stringify({
        ...message,
        ref: this.requestId,
      })
    );

    const promise = new Promise<void>((resolve, reject) => {
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
        this.requests[message.ref].rs();
      }

      if (message.type === 'ERROR') {
        this.requests[message.ref].rj();
      }

      delete this.requests[message.ref];
    }
  };
}

const ws = new WebSocket('hi');
// TODO: we should wait for the websocket to be connected fully before anything else

const client = new BattleshipClient(ws);
