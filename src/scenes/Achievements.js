class Achievements extends Phaser.Scene {
    constructor() {
        super("Achievements")
    }

    preload () {
        // load images
        this.load.image('background', './assets/background.png')
    }

    create() {
        this.add.text(100, 100, 'Achievements', { fontSize: '32px', fill: '#fff' })

        this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0,0)

        // rework to display a leaderboard
        
        // back button
        let backButton = this.add.text(100, 300, 'Back to Menu', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}