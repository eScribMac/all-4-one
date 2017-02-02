import { bullets, player } from './create.js';
import { playerCollide } from './createMap.js';
import { monsters, monstersLocation } from '../controls/controls.js';
import Teammate from '../entities/teammate.js';
import store from '../../store.js';
import { receiveHealth } from '../../reducers/players.js';
import GameMaster from '../controls/gameMaster.js';

let teammates = {};

export default function update() {
  //  Collision
  this.physics.arcade.collide(player.player, playerCollide)

  player.update();

  //#gamemaster - maybe? not sure how this logic is going to work
  for (let i = 0; i < monsters.length; i++) {
      monsters[i].update(player.player.x, player.player.y);
      this.physics.arcade.collide(player.player, monsters[i].monster, (player, monster) => {
          if (this.game.time.now > monster.nextAttack) {
              player.body.immovable = true;
              // monster.body.immovable = true;
              monster.nextAttack = this.game.time.now + monster.attackRate;
              player.health -= 20;
              store.dispatch(receiveHealth({health: player.health}));
          }
          if (player.health <= 0) {
              player.kill();
              player.healthBar.kill();
          }
      });

      for (let j = 0; j < monsters.length; j++) {
          if (i !== j && monsters[j]) {
              this.physics.arcade.collide(monsters[i].monster, monsters[j].monster);
          }
      }
      this.physics.arcade.collide(monsters[i].monster, playerCollide);

      this.physics.arcade.collide(bullets.bullets, monsters[i].monster, (monster, bullet) => {
          bullet.kill();
          monster.health -= 20;
          if (monster.health <= 0 ) {
              monster.kill();
              monster.healthBar.kill();
              monsters.splice(i, 1);
          }
      });
  }

  // socket.emit('monsterMove', {monsters: monstersLocation});

  let players = store.getState().players;
  //delete teammate if they disconnect
  for (let id in teammates) {
      if (!players[id]) {
          teammates[id].kill();
          delete teammates[id];
      }
  }

  for (let id in players) {
    if (id !== player.id) {
      if (teammates[id]){
        this.physics.arcade.collide(player.player, teammates[id].sprite);

        //healthbar
        teammates[id].sprite.healthBar.setPosition(teammates[id].sprite.x - 7, teammates[id].sprite.y - 40);
        teammates[id].sprite.healthBar.setPercent(players[id].health);
        if (players[id].health <= 0) {
          teammates[id].kill();
        }

        //bullets
        if (players[id].bool) {
          teammates[id].fire(players[id].fire, players[id].rate);
        }

        //if the player already exists, just move them
        if (players[id].animation !== 'stop') {
          teammates[id].sprite.x = players[id].position.x;
          teammates[id].sprite.y = players[id].position.y;
          teammates[id].sprite.animations.play(players[id].animation);

        } else {
          teammates[id].sprite.animations.stop();
          teammates[id].sprite.frame = 7;
        }
      //else create them at the place they need to be
      } else if (players[id].position) {
        teammates[id] = new Teammate(id, this, players[id].position.x, players[id].position.y);
      }
    }
  }
}