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
        this.load.audio('open chest', 'assets/open chest.wav')
    }

    create() {
        // Play underwater ambiance sound
        this.sound.play('underwater', { loop: true, volume: 1 })

        // tilemap stuff
        const map = this.add.tilemap('mapJSON')
        const tileset = map.addTilesetImage('map', 'mapTiles')

        // maze layer (mark as collidable) from tilemap
        const mazeLayer = map.createLayer('maze', tileset, 0, 0)
        mazeLayer.setCollisionByProperty({ collide: true })

        // game variables
        this.score = 0
        this.chestfound = 0
        this.gameOver = false

        // object layer
        const objectsLayer = map.getObjectLayer('objects')

        // iterate through objects 
        // class player: create sprite called player with sprite.png at that location that can be moved by the player
        // class octopus: create sprite called octopus with octopus.png that moves randomly, can collide with player and boundaries
        // class squida: create sprite called squida with squid1.png that moves randomly, can collide with player and boundaries
        // of class squidb: create sprite called squidb with squid2.png that moves randomly, can collide with player and boundaries
        // of class chest: create sprite called chest with chest.png that can be collected for points and temporarily hidden from the game
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
                    // player loses health when colliding with octopus
                    this.physics.add.collider(octopus, this.player)
                    // Add random movement logic for octopus here
                    this.setupRandomMovement(octopus)
                    break

                case 'squida':
                    // Create squida sprite
                    const squida = this.physics.add.sprite(obj.x, obj.y, 'squida')
                    squida.body.setCollideWorldBounds(true)
                    this.physics.add.collider(squida, mazeLayer)
                    // player loses health when colliding with squida
                    this.physics.add.collider(squida, this.player)
                    // Add random movement logic for squida here
                    this.setupRandomMovement(squida)
                    break

                case 'squidb':
                    // Create squidb sprite
                    const squidb = this.physics.add.sprite(obj.x, obj.y, 'squidb')
                    squidb.body.setCollideWorldBounds(true)
                    this.physics.add.collider(squidb, mazeLayer)
                    // player loses health when colliding with squidb
                    this.physics.add.collider(squidb, this.player)
                    // Add random movement logic for squidb here
                    this.setupRandomMovement(squidb)
                    break

                case 'chest':
                    // Create chest sprite
                    const chest = this.physics.add.sprite(obj.x, obj.y, 'chest')
                    chest.body.setImmovable(true)
                    chest.body.setCollideWorldBounds(true)
                    this.physics.add.collider(chest, mazeLayer)
                    // add collect chest interaction here
                    this.physics.add.overlap(this.player, chest, this.collectChest, null, this)
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

        /* this.timeLeft = 20
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        }) */
    }

    /* updateTimer() {
        this.timeLeft--
        
        if (this.timeLeft === 0) {
            this.timerEvent.remove()
            this.gameOver = true
            this.showGameOverScreen()
        }
    }

    showGameOverScreen() {
        this.physics.pause() 

        const gameOverText = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 100,
            'Game Over',
            {
                fontSize: '64px',
                fill: '#ff0000',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)

        const resetButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Reset',
            {
                fontSize: '32px',
                fill: '#00ff00',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setInteractive()

        resetButton.on('pointerdown', () => {
            this.scene.restart()
        })

        const menuButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Back to Menu',
            {
                fontSize: '32px',
                fill: '#00ff00',
                fontSytle: 'bold'
            }
        ).setOrigin(0.5).setInteractive()

        menuButton.on('pointerdown', () => {
            this.scene.start('Menu')
        })
    } */

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
        if (this.gameOver) return

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

        /* // check collisions
        if(this.checkCollision(this.player, this.chest)){
            // play chest open sound
            this.sound.play('open chest')

            // hide chest
            this.chest.disableBody(true, true)

            // this.score += random number between 25 and 50
            this.score += Phaser.Math.Between(25, 50)

            // this.chestfound += 1
            this.chestfound += 1
        } */
    }

    collectChest(player, chest) {
        this.sound.play('open chest', { loop: false, volume: 1 })
        const x = chest.x
        const y = chest.y

        // hide the chest png
        // chest.disableBody(true, true)
        chest.destroy();

        // disable chest body temporarily
        // this.physics.world.disable(chest)

        this.score += Phaser.Math.Between(25, 50)
        console.log(this.score)

        this.chestfound += 1
        console.log(this.chestfound)

        // Re-enable the chest after 30 seconds
        this.time.delayedCall(3000, () => {
            const chest = this.physics.add.sprite(x, y, 'chest')
            chest.body.setImmovable(true)
            chest.body.setCollideWorldBounds(true)
            // add collect chest interaction here
            this.physics.add.overlap(this.player, chest, this.collectChest, null, this)
        })
    }
}