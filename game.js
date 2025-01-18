
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MainMenu, GameScene, GameOverScene],
};

const game = new Phaser.Game(config);

class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    this.load.image('background', 'assets/background.jpg');
  }

  create() {
    this.add.image(400, 300, 'background');
    this.add.text(300, 250, 'Battle Royale Offline', {
      fontSize: '32px',
      color: '#ffffff',
    });
    this.add.text(300, 350, 'Press SPACE to Start', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('weapon', 'assets/weapon.png');
    this.load.image('map', 'assets/map.png');
  }

  create() {
    this.add.image(400, 300, 'map');
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);
    this.enemies = this.physics.add.group();
    for (let i = 0; i < 10; i++) {
      const enemy = this.enemies.create(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 500),
        'enemy'
      );
      enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
      enemy.setCollideWorldBounds(true);
      enemy.setBounce(1);
    }
    this.weapons = this.physics.add.group();
    this.weapons.create(200, 200, 'weapon');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.overlap(
      this.player,
      this.weapons,
      this.collectWeapon,
      null,
      this
    );
    this.physics.add.collider(this.player, this.enemies, this.gameOver, null, this);
  }

  update() {
    this.player.setVelocity(0);
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
    }
  }

  collectWeapon(player, weapon) {
    weapon.destroy();
  }

  gameOver(player, enemy) {
    this.scene.start('GameOverScene');
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    this.add.text(300, 250, 'Game Over!', { fontSize: '32px', color: '#ff0000' });
    this.add.text(300, 350, 'Press SPACE to Restart', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
