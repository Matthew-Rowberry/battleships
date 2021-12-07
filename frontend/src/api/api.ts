// type Message = unknown;

// // interface IClient {
// //   send(message: Message): Promise<>;
// // }

// const createApiClient = async (wsURL) => {
//   return {};
// };

// const client = await createApiClient('ws://wasdasd');

// try {
//   const response = await client.send({
//     type: 'SEND_MESSAGE',
//     payload: { content: 'hi' },
//   });
// } catch (e) {
//   console.log(e);
// }

// client.subscribe('RECIEVE_MESSAGE', (m) => {
//   console.log('based');
// });

class BattleshipClient {
  public async send(message: Message): Promise<void> {}

  public subscribe(message: string, callback: Function) {}
}

const client = new BattleshipClient();
