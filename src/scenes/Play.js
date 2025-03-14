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
        this.load.audio('dull thud', 'assets/dull thud.wav')
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
                    this.player.health = 10
                    break

                case 'octopus':
                    // Create octopus sprite
                    const octopus = this.physics.add.sprite(obj.x, obj.y, 'octopus')
                    octopus.body.setCollideWorldBounds(true)
                    this.physics.add.collider(octopus, mazeLayer)
                    // player loses health when colliding with octopus
                    this.physics.add.collider(octopus, this.player, this.handleCreatureCOllision, null, this)
                    // Add random movement logic for octopus here
                    this.setupRandomMovement(octopus)
                    break

                case 'squida':
                    // Create squida sprite
                    const squida = this.physics.add.sprite(obj.x, obj.y, 'squida')
                    squida.body.setCollideWorldBounds(true)
                    this.physics.add.collider(squida, mazeLayer)
                    // player loses health when colliding with squida
                    this.physics.add.collider(squida, this.player, this.handleCreatureCOllision, null, this)
                    // Add random movement logic for squida here
                    this.setupRandomMovement(squida)
                    break

                case 'squidb':
                    // Create squidb sprite
                    const squidb = this.physics.add.sprite(obj.x, obj.y, 'squidb')
                    squidb.body.setCollideWorldBounds(true)
                    this.physics.add.collider(squidb, mazeLayer)
                    // player loses health when colliding with squidb
                    this.physics.add.collider(squidb, this.player, this.handleCreatureCOllision, null, this)
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

        // controls options
        const controlScheme = this.registry.get('controls') || 'arrows'

        // Set up controls based on the selected scheme
        if (controlScheme === 'wasd') {
            this.cursors = this.input.keyboard.addKeys({
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S
            })
        } else if (controlScheme === 'arrows') {
            this.cursors = this.input.keyboard.addKeys({
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN
            })
        } else if (controlScheme === 'mouse') {
            // Initialize mouse target position
            this.mouseTarget = null
        }

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        // this.cursors = this.input.keyboard.createCursorKeys()

        /* this.clock = this.time.delayedCall(2000, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this) */

        // Create the text object -- edit it to keep track of the health of player sprite
        this.healthtext = this.add.text(0, 0, `Health: ${this.player.health}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        })

        // Fix the text to the camera
        this.healthtext.setScrollFactor(0)

        // Position the text at the top-left corner of the camera
        this.healthtext.setPosition(this.cameras.main.worldView.x + 10, this.cameras.main.worldView.y + 10)

        // add a text object to keep track of points and chests collected
        this.pointstext = this.add.text(0, 0, `Points ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        })

        // Fix the text to the camera
        this.pointstext.setScrollFactor(0)

        // Position the text at the top-left corner of the camera
        this.pointstext.setPosition(this.cameras.main.worldView.x + 10, this.cameras.main.worldView.y + 40)

        this.cheststext = this.add.text(0, 0, `Chests: ${this.chestfound}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        })

        // Fix the text to the camera
        this.cheststext.setScrollFactor(0)

        // Position the text at the top-left corner of the camera
        this.cheststext.setPosition(this.cameras.main.worldView.x + 10, this.cameras.main.worldView.y + 70)

        // text to upper left to keep track of seconds left
        // maybe also add a interactable button to go directly back to main menu

        // fix timer
        const timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 150
        }

        this.timerText = this.add.text(0, 0, 'Time: 120', timerConfig)
        this.timerText.setScrollFactor(0)
        this.timerText.setPosition(
            this.cameras.main.worldView.x + this.cameras.main.width - this.timerText.width - 10, // X position (right-aligned)
            this.cameras.main.worldView.y + 10 // Y position (top-aligned)
        )

        // Set up the game timer
        this.clock = this.time.delayedCall(120000, () => { // 120 seconds -- change to longer later on
            this.endGame()
        }, null, this)
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

    handleCreatureCollision(player, creature) {
        this.sound.play('dull thud', { volume: 1})

        // reduce player health
        player.health -= 1
        this.healthtext.setText(`Health: ${player.health}`)

        // check if health is depleted
        if (player.health <= 0) {
            this.endGame()
        }
    }

    endGame() {
        this.gameOver = true

        // Freeze all sprites and physics
        this.physics.pause()

        // retrieve best score and most chests from registry
        const bestScore = this.registry.get('bestScore') || 0
        const mostChests = this.registry.get('mostChests') || 0
        const sameGame = this.registry.get('sameGame') || false

        // check if there are new high scores
        const isNewHighScore = this.score > bestScore
        const isNewMostChests = this.chestfound > mostChests
        this.registry.set('sameGame', (isNewHighScore && isNewMostChests))

        if(isNewHighScore) {
            this.registry.set('bestScore', this.score)
        }
        if (isNewMostChests) {
            this.registry.set('mostChests', this.chestfound)
        }

        // game over text
        const gameOverText = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 - 100,
            'GAME OVER', {
            fontFamily: 'Arial',
            fontSize: '64px',
            fill: '#ff0000',
            backgroundColor: '#000000'
        }
        ).setOrigin(0.5)

        // display high scores if applicable
        if (isNewHighScore && isNewMostChests) {
            this.add.text(
                this.cameras.main.worldView.x + this.cameras.main.width / 2,
                this.cameras.main.worldView.y + this.cameras.main.height / 2,
                'Congrats! Both scores are high scores!', {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    fill: '#00ff00',
                    backgroundColor: '#000000',
                    align: 'center'
                }
            ).setOrigin(0.5)
        } else if (isNewHighScore) {
            this.add.text(
                this.cameras.main.worldView.x + this.cameras.main.width / 2,
                this.cameras.main.worldView.y + this.main.cameras.main.height / 2,
                'You got the new high score!', {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    fill: '#00ff00',
                    backgroundColor: '#000000',
                    align: 'center'
                }
            ).setOrigin(0.5)
        } else if (isNewMostChests) {
            this.add.text(
                this.cameras.main.worldView.x + this.cameras.main.width / 2,
                this.cameras.main.worldView.y + this.cameras.main.height / 2,
                'You found the most chests!', {
                    fontFamily: 'Arial', 
                    fontSize: '32px',
                    fill: '#00ff00',
                    backgroundColor: '#000000',
                    align: 'center'
                }
            ).setOrigin(0.5)
        }

        // display current and best score
        this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 + 50,
            `Score: ${this.score} | Best Score: ${this.registry.get('bestScore')}`, {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                align: 'center'
            }
        ).setOrigin(0.5)

        // display current and most chests
        this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 + 100,
            `Chests Found: ${this.chestfound} | Most Chests: ${this.registry.get('mostChests')}`, {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                align: 'center'
            }
        ).setOrigin(0.5)

        // restart button
        const restartButton = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 + 150,
            'Restart', {
            fontFamily: 'Arial',
            fontSize: '32px',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }
        ).setOrigin(0.5).setInteractive()

        // add hover effect
        restartButton.on('pointerover', () => {
            restartButton.setBackgroundColor('#555555')
        })
        restartButton.on('pointerout', () => {
            restartButton.setBackgroundColor('#000000')
        })
        restartButton.on('pointerdown', () => {
            this.scene.restart()
        })

        // create menu button
        const menuButton = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 + 200,
            'Back to Menu', {
            fontFamily: 'Arial',
            fontSize: '32px',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }
        ).setOrigin(0.5).setInteractive()

        // add hover effect
        menuButton.on('pointerover', () => {
            menuButton.setBackgroundColor('#555555')
        })
        menuButton.on('pointerout', () => {
            menuButton.setBackgroundColor('#000000')
        })
        menuButton.on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }

    setupRandomMovement(sprite) {
        // Random movement logic (same as before)
        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000),
            callback: () => {
                const directions = [
                    { x: 1, y: 0 },   // Right
                    { x: -1, y: 0 },  // Left
                    { x: 0, y: 1 },   // Down
                    { x: 0, y: -1 }   // Up
                ]
                const direction = Phaser.Utils.Array.GetRandom(directions)
                sprite.setVelocity(direction.x * 100, direction.y * 100)
            },
            loop: true
        })
    }

    update() {
        if (this.gameOver) {
            return
        }

        // Update timer text
        const remainingTime = Math.ceil(this.clock.getRemainingSeconds());
        this.timerText.setText(`Time: ${remainingTime}`)

        // Player movement speed
        const speed = 200

        // Reset player velocity
        this.player.setVelocity(0)

        if (this.cursors) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed)
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed)
            }

            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-speed)
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(speed)
            }

            // Optional: Normalize diagonal movement to prevent faster diagonal speed
            if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
                this.player.body.velocity.normalize().scale(speed)
            }
        } else {
            const pointer = this.input.activePointer

            if (pointer.isDown) {
                //this.mouseTarget = { x: pointer.worldX, y: pointer.worldY }
                this.mouseTarget = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
            }

            if (this.mouseTarget) {
                // Calculate direction vector
                const direction = new Phaser.Math.Vector2(
                    this.mouseTarget.x - this.player.x,
                    this.mouseTarget.y - this.player.y
                );

                // Normalize the direction vector and scale it by speed
                direction.normalize().scale(speed);

                // Set player velocity
                this.player.setVelocity(direction.x, direction.y)

                // Stop the player when close to the target
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.mouseTarget.x, this.mouseTarget.y)
                if (distance < 10) {
                    this.player.setVelocity(0, 0);
                    this.mouseTarget = null;
                }
            }
        }

        /* // Check for collisions between player and sea creatures
        if (this.checkCollision(this.player, this.octopus)) {
            this.player.health -= 1
            this.healthtext.setText(`Health: ${this.player.health}`)
        }
        if (this.checkCollision(this.player, this.squida)) {
            this.player.health -= 1
            this.healthtext.setText(`Health: ${this.player.health}`)
        }
        if (this.checkCollision(this.player, this.squidb)) {
            this.player.health -= 1
            this.healthtext.setText(`Health: ${this.player.health}`)
        }

        console.log(this.player.health)

        // Check if player health is 0
        if (this.player.health <= 0) {
            this.endGame();
        } */
    }

    collectChest(player, chest) {
        this.sound.play('open chest', { loop: false, volume: 1 })

        //save the coordinates
        const x = chest.x
        const y = chest.y

        // hide the chest png
        // chest.disableBody(true, true)
        chest.destroy();

        // disable chest body temporarily
        // this.physics.world.disable(chest)

        this.score += Phaser.Math.Between(25, 50)
        console.log(this.score)
        this.pointstext.setText(`Points: ${this.score}`)

        this.chestfound += 1
        console.log(this.chestfound)
        this.cheststext.setText(`Chests: ${this.chestfound}`)

        // Re-enable the chest after 30 seconds
        this.time.delayedCall(30000, () => {
            const chest = this.physics.add.sprite(x, y, 'chest')
            chest.body.setImmovable(true)
            chest.body.setCollideWorldBounds(true)
            // add collect chest interaction here
            this.physics.add.overlap(this.player, chest, this.collectChest, null, this)
        })
    }

    /* checkCollision(player, creature) {
        return this.physics.overlap(player, creature)
    } */
}