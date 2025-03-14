class Achievements extends Phaser.Scene {
    constructor() {
        super("Achievements")
    }

    preload () {
        // load images
        this.load.image('background', './assets/background.png')
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0,0)

        this.add.text(100, 100, 'Achievements', { fontSize: '32px', fill: '#fff' })

        const bestScore = this.registry.get('bestScore') || 0
        const mostChests = this.registry.get('mostChests') || 0
        const highScoreAndChestsInSameGame = this.registry.get('highScoreAndChestsInSameGame') || false

        // Display highest score
        this.add.text(100, 120, `Highest Score: ${bestScore}`, {
            fontSize: '24px',
            fill: '#fff'
        })

        // Display most chests found
        this.add.text(100, 160, `Most Chests Found: ${mostChests}`, {
            fontSize: '24px',
            fill: '#fff'
        })

        // Display whether both high scores were achieved in the same game
        if (highScoreAndChestsInSameGame) {
            this.add.text(100, 200, 'Achieved both high scores in the same game!', {
                fontSize: '24px',
                fill: '#00ff00' // Green text for emphasis
            })
        }

        let backButton = this.add.text(100, 300, 'Back to Menu', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}