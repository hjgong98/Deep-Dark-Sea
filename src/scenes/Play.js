class Play extends Phaser.Scene {
    constructor() {
        super("Play")
    }

    preload() {
        // load sprite
        this.load.image('player', 'assets/sprite.png')

        // load the tileset image
        this.load.image('mapTiles', 'assets/map.png')

        // load the tilemap JSON file
        this.load.tilemapTiledJSON('mapJSON', 'assets/map.json')
    }

    create() {
        // tilemap stuff
        const map = this.add.tilemap('mapJSON')
        const tileset = map.addTilesetImage('map', 'mapTiles')

        // maze layer (mark as collidable) from tilemap
        const mazeLayer = map.createLayer('maze', tileset, 0, 0)
        mazeLayer.setCollisionByProperty({ collide: true })

        // player sprite location from player object layer, look for the location of an object called 'playStart'
        const playerSpawn = map.findObject('players', obj => obj.name === 'playStart')
        this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'player')
        this.player.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, mazeLayer)

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25)
        
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        //use arrow keys to move player around

        // Player movement speed
        const speed = 200;

        // Reset player velocity
        this.player.setVelocity(0);
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed); // Move left
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed); // Move right
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed); // Move up
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed); // Move down
        }

        // Optional: Normalize diagonal movement to prevent faster diagonal speed
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
            this.player.body.velocity.normalize().scale(speed);
        }
    }
}