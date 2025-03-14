class Instructions extends Phaser.Scene {
    constructor() {
        super("Instructions")
    }

    preload () {
        // load images
        this.load.image('background', './assets/background.png')
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0,0)
        
        // title
        this.add.text(100, 100, 'Instructions', { fontSize: '32px', fill: '#fff' })

        // get selected contol scheme from registry
        const controlScheme = this.registry.get('controls') || 'arrows' // Default to 'wasd' if none selected

        // display instructions based on control scheme
        if (controlScheme === 'wasd') {
            this.add.text(100, 200, 'Use WASD to move', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 235, 'Press A to move left', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 270, 'Press D to move right', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 305, 'Press W to move up', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 340, 'Press S to move down', { fontSize: '24px', fill: '#fff' })
        } else if (controlScheme === 'arrows') {
            this.add.text(100, 200, 'Use Arrow Keys to move', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 235, 'Press LEft to go left', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 270, 'Press RIGHT to go right', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 305, 'Press UP to go up', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 340, 'Press DOWN to go down', { fontSize: '24px', fill: '#fff' })
        } else if (controlScheme === 'mouse') {
            this.add.text(100, 200, 'Use mouse to move', { fontSize: '24px', fill: '#fff' })
            this.add.text(100, 235, 'Left click to jump', { fontSize: '24px', fill: '#fff' })
        }


        // Button to return to the Menu
        let menuButton = this.add.text(100, 375, 'Back to Menu', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}