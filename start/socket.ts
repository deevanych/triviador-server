import Ws from 'App/Services/Ws'
import User from 'App/Models/User'
import { Socket } from 'socket.io'
Ws.boot()

/**
 * Listen for incoming socket connections
 */

class UserInfoSocket extends Socket {
  public rating: number;
  public userId: number;
}

Ws.io.on('connection', (socket: UserInfoSocket) => {
  socket.on('joinPlayersQueueRoom', () => {
    User.find(Math.floor(Math.random() * (3 - 1) + 1)).then((data: User) => {
      socket.rating = data.rating;
      socket.userId = Math.floor(Math.random() * (3 - 1) + 1);
      socket.join('playersQueueRoom');
    });

    const users = Ws.io.sockets.adapter.rooms.get('playersQueueRoom');
    users?.forEach((socketId) => {
      const user: UserInfoSocket = Ws.io.sockets.sockets.get(socketId) as UserInfoSocket;
      console.log(user.rating);
    });
  });
})
