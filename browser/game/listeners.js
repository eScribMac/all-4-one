import store from '../store'
import {receivePlayerdata} from '../reducers/players.js'
import {updateTime} from '../reducers/game.js'

export default socket => {

  socket.on('game_data', data => {
    // console.log(data)
    store.dispatch(receivePlayerdata(data.players));
    store.dispatch(updateTime(data.engine.minutes, data.engine.seconds))
  });

  socket.on('end_game', data => {
    if (data.survivorWin) {
      //phaser freeze, display message on screen, redirect to somewhere
    }
  })

};

