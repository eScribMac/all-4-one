import {bullets, fireRate} from './create.js' //change to being from bullets file 
import Monster from './entities/monsters.js';
    
// Check for movement
const moveCheck = function(){
  
  if (this.wasd.up.isDown && this.wasd.left.isDown) {
    //  Move up-left
    this.player.body.velocity.x = -150;
    this.player.body.velocity.y = -150;
    this.player.animations.play('left');
  } else if (this.wasd.up.isDown && this.wasd.right.isDown) {
    //  Move up-right
    this.player.body.velocity.x = 150;
    this.player.body.velocity.y = -150;
    this.player.animations.play('right');
  } else if (this.wasd.down.isDown && this.wasd.left.isDown) {
    //  Move down-left
    this.player.body.velocity.x = -150;
    this.player.body.velocity.y = 150;
    this.player.animations.play('left');
  } else if (this.wasd.down.isDown && this.wasd.right.isDown) {
    //  Move down-right
    this.player.body.velocity.x = 150;
    this.player.body.velocity.y = 150;
    this.player.animations.play('right');
  } else if (this.wasd.left.isDown) {
    //  Move left
    this.player.body.velocity.x = -150;
    this.player.animations.play('left');
  } else if (this.wasd.right.isDown) {
    //  Move right
    this.player.body.velocity.x = 150;
    this.player.animations.play('right');
  } else if (this.wasd.up.isDown) {
    //  Move up
    this.player.body.velocity.y = -150;
    this.player.animations.play('up');
  } else if (this.wasd.down.isDown) {
    //  Move down
    this.player.body.velocity.y = 150;
    this.player.animations.play('down');
  } else {
    //  Stand still
    this.player.animations.stop();
    this.player.frame = 0;
  }

}


//fire bullets
const fireBulletsCheck = function(){
  if (this.cursors.up.isDown && this.cursors.left.isDown) {
    fire.call(this,'up-left');
  } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
    fire.call(this,'up-right');
  } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
    fire.call(this,'down-left');
  } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
    fire.call(this,'down-right');
  } else if (this.cursors.left.isDown) {
    fire.call(this,'left');
  } else if (this.cursors.right.isDown) {
    fire.call(this,'right');
  } else if (this.cursors.up.isDown) {
    fire.call(this,'up');
  } else if (this.cursors.down.isDown) {
    fire.call(this,'down');
  }
}

//fire helper function
const fire = function(direction) {
  if (this.game.time.now > this.nextFire && bullets.countDead() > 0) {
    this.nextFire = this.game.time.now + fireRate;
    var bullet = bullets.getFirstDead();
    bullet.scale.setTo(0.5);
    bullet.reset(this.player.x, this.player.y);
    switch(direction) {
      case 'left' : this.game.physics.arcade.moveToXY(bullet, -1000, this.player.y, 500); break;
      case 'right': this.game.physics.arcade.moveToXY(bullet, 1000, this.player.y, 500); break;
      case 'up': this.game.physics.arcade.moveToXY(bullet, this.player.x, -1000, 500); break;
      case 'down': this.game.physics.arcade.moveToXY(bullet, this.player.x, 1000, 500); break;
      case 'up-left': this.game.physics.arcade.moveToXY(bullet, this.player.x - 1000, this.player.y - 1000, 500); break;
      case 'up-right': this.game.physics.arcade.moveToXY(bullet, this.player.x + 1000, this.player.y - 1000, 500); break;
      case 'down-left': this.game.physics.arcade.moveToXY(bullet, this.player.x - 1000, this.player.y + 1000, 500); break;
      case 'down-right': this.game.physics.arcade.moveToXY(bullet, this.player.x + 1000, this.player.y + 1000, 500); break;
    }
  }
}

const spawnMonster = function() {
  if (this.game.input.activePointer.isDown) {
    var monster = new Monster(1, this.game, {x: this.game.input.activePointer.worldX, y: this.game.input.activePointer.worldY});
  }
};

export { moveCheck, fireBulletsCheck, fire, spawnMonster }
