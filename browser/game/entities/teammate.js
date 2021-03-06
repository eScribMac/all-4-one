// import {healthBarsGroup} from '../engine/create.js'
import HealthBar from './HealthBar.js';
import { teamBullet, blaster, teamExplosions, explosionsound, teamSgBullets } from '../engine/create.js' //change to being from bullets file
import survivorsDictionary from '../dictionaries/survivorsDictionary.js'

export default class Teammate {
  constructor(id, game, xCord, yCord, playerType){
    this.id = id;
    this.game = game;
    this.playerType = survivorsDictionary[playerType]
    this.create(xCord, yCord);
    this.nextFire = 0;
    this.totalHealth = 100;
  }

  create(xCord, yCord) {
    this.sprite = this.game.add.sprite(xCord, yCord, this.playerType.name);
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.anchor.set(0.5);
    this.sprite.animations.add('left', this.playerType.animations.left, 7, true);
    this.sprite.animations.add('right', this.playerType.animations.right, 7, true);
    this.sprite.animations.add('down', this.playerType.animations.down, 7, true);
    this.sprite.animations.add('up', this.playerType.animations.up, 7, true);
    this.sprite.body.immovable = true;
    // this.sprite.body.setSize(60, 80, 45, 35);
    this.sprite.health = 100;
    this.sprite.healthBar = new HealthBar(this.game, {width: 70, height: 10, x: this.sprite.x - 7, y: this.sprite.y - 40, bar: {color: 'blue'}, bg: {color: 'black'}});
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  kill() {
    this.sprite.kill();
    this.sprite.healthBar.kill();
  }

  fire (angle, fireRate) {

    if ((angle >= 0) && this.game.time.now > this.nextFire) {
      blaster.play('', 0, 0.3);
      this.nextFire = this.game.time.now + this.playerType.fireRate;

      if (this.playerType.shotgun) {
        for (let i = -2; i < 3; i++) {
          let sgbullet = teamSgBullets.sprite.getFirstDead();
          sgbullet.scale.setTo(1);
          sgbullet.body.setSize(20, 30);
          sgbullet.reset(this.sprite.x, this.sprite.y);
          let xCord = this.sprite.x + (10000 * Math.cos(angle + (Math.PI / 25 * i)));
          let yCord = this.sprite.y + (-10000 * Math.sin(angle + (Math.PI / 25 * i)));
          this.game.physics.arcade.moveToXY(sgbullet, xCord, yCord, 600);
          sgbullet.originalLocation = {x: sgbullet.x, y: sgbullet.y};
          sgbullet.damage = this.playerType.damage;
        }
      } else {
        let bullet = teamBullet.sprite.getFirstDead();
        bullet.scale.setTo(1);
        bullet.body.setSize(20, 30);
        bullet.reset(this.sprite.x, this.sprite.y);
        let xCord = this.sprite.x + (10000 * Math.cos(angle));
        let yCord = this.sprite.y + (-10000 * Math.sin(angle));
        this.game.physics.arcade.moveToXY(bullet, xCord, yCord, 600);
        bullet.originalLocation = {x: bullet.x, y: bullet.y};
        bullet.damage = this.playerType.damage;
      }
    }
  }


  rangeSplash(xCord, yCord, fireRate) {
    if ((xCord || yCord) && this.game.time.now > this.nextFire) {
      this.nextFire = this.game.time.now + fireRate
      let explosion = teamExplosions.sprite.getFirstDead()
      explosion.scale.setTo(1)
      explosion.reset(this.sprite.x + xCord, this.sprite.y + yCord)
      explosion.damage = this.playerType.damage;
      explosion.animations.add('explosion', this.playerType.attackAnimations.animate, 20, false)
      explosion.animations.add('explosionBack', this.playerType.attackAnimations.animateBack, 60, false)
      explosion.animations.play('explosion')

      setTimeout( () => {
        explosionsound.play('', 0, 1.0);
      }, 1300);
      setTimeout( () => {
        explosion.animations.play('explosionBack');
      }, 1500);
      setTimeout( () => {
        explosion.kill();
      }, 2000);
    }
  }

}
