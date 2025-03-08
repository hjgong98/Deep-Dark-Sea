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

        // load chest
        this.load.image('chest', 'assets/chest.png')

        // load sea creatures 
        this.load.image('octopus', 'assets/octopus.png')
        this.load.image('squida', 'assets/squid1.png')
        this.load.image('squidb', 'assets/squid2.png')

        // load sound
        this.load.audio('underwater', 'assets/underwater ambiance.wav')
    }

    create() {
        // Play underwater ambiance sound
        this.sound.play('underwater', { loop: true, volume: 0.25 })

        // tilemap stuff
        const map = this.add.tilemap('mapJSON')
        const tileset = map.addTilesetImage('map', 'mapTiles')

        // maze layer (mark as collidable) from tilemap
        const mazeLayer = map.createLayer('maze', tileset, 0, 0)
        mazeLayer.setCollisionByProperty({ collide: true })

        // object layer
        const objectsLayer = map.getObjectLayer('objects')

        // iterate through objects 
        // object of class player: create a sprite called player with sprite.png at that location that can be moved by the player
        // object of class octopus: create a sprite called octopus with octopus.png that moves randomly and can collide with player and boundaries
        // object of class squida: create a sprite called squida with squid1.png that moves randomly and can collide with player and boundaries.
        // object of class squidb: create a sprite called squidb with squid2.png that moves randomly and can collide with player and boundaries.
        // object of class chest: create a sprite called chest with chest.png that can be collected for points and temporarily hidden from the game
        objectsLayer.objects.forEach(obj => {
            switch (obj.type) {
                case 'player':
                    // Create player sprite
                    this.player = this.physics.add.sprite(obj.x, obj.y, 'player')
                    this.player.body.setCollideWorldBounds(true)
                    this.physics.add.collider(this.player, mazeLayer)
                    break
    
                case 'octopus':
                    // Create octopus sprite
                    const octopus = this.physics.add.sprite(obj.x, obj.y, 'octopus')
                    octopus.body.setCollideWorldBounds(true)
                    this.physics.add.collider(octopus, mazeLayer)
                    this.physics.add.collider(octopus, this.player)
                    // Add random movement logic for octopus here
                    this.setupRandomMovement(octopus)
                    break
    
                case 'squida':
                    // Create squida sprite
                    const squida = this.physics.add.sprite(obj.x, obj.y, 'squida')
                    squida.body.setCollideWorldBounds(true)
                    this.physics.add.collider(squida, mazeLayer)
                    this.physics.add.collider(squida, this.player)
                    // Add random movement logic for squida here
                    this.setupRandomMovement(squida)
                    break
    
                case 'squidb':
                    // Create squidb sprite
                    const squidb = this.physics.add.sprite(obj.x, obj.y, 'squidb')
                    squidb.body.setCollideWorldBounds(true)
                    this.physics.add.collider(squidb, mazeLayer)
                    this.physics.add.collider(squidb, this.player)
                    // Add random movement logic for squidb here
                    this.setupRandomMovement(squidb)
                    break;
    
                case 'chest':
                    // Create chest sprite
                    const chest = this.physics.add.sprite(obj.x, obj.y, 'chest')
                    chest.body.setCollideWorldBounds(true)
                    this.physics.add.collider(chest, mazeLayer)
                    // Add logic for collecting chest here
                    break
    
                default:
                    console.warn(`Unknown object type: ${obj.type}`)
                    break
            }
        })

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25)
        
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    setupRandomMovement(sprite) {
        // Random movement logic
        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000), // Random delay between 1 and 3 seconds
            callback: () => {
                const directions = [
                    { x: 1, y: 0 },   // Right
                    { x: -1, y: 0 },  // Left
                    { x: 0, y: 1 },   // Down
                    { x: 0, y: -1 }   // Up
                ]
                const direction = Phaser.Utils.Array.GetRandom(directions)
                sprite.setVelocity(direction.x * 100, direction.y * 100) // Move in random direction
            },
            loop: true
        })
    }

    update() {
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