class Menu extends Phaser.Scene {
    constructor() {
        super("Menu")
    }

    preload () {
        // load images
        this.load.image('background', './assets/background.png')
    }

    create() {
        // menu background
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0,0)
        
        // menu UI
        this.add.text(100, 100, 'Main Menu', { fontSize: '32px', fill: '#fff' })


        // go to controls scene
        let controlsButton = this.add.text(100, 175, 'Choose Controls', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Controls')
        })

        // how to play
        let instructionsButton = this.add.text(100, 215, 'Instructions', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Instructions')
        })

        // go to sprite scene
        let spritesButton = this.add.text(100, 255, 'Objectives', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Objectives')
        })

        // go to play scene
        let playButton = this.add.text(100, 295, 'Start Game', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Play')
        })

        // achievements
        let achievementButton = this.add.text(100, 335, 'Achievements', {
            fontSize: '24px',
            fill: '#fff'
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Achievements')
        })

        // credits
        let creditsButton = this.add.text(100, 375, 'Credits', {
            fontSize: '24px',
            fill: '#fff'
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Credits')
        })
    }
}