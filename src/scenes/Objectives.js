class Objectives extends Phaser.Scene {
    constructor() {
        super("Objectives")
    }

    preload () {
        // load images
        this.load.image('background', './assets/background.png')
    }

    create() {
        // menu background
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0,0)

        // menu UI
        this.add.text(100, 100, 'Objectives', { fontSize: '32px', fill: '#fff' })

        // Display objectives
        this.add.text(100, 160, '1. Collect chests for points', {
            fontSize: '16px',
            fill: '#fff'
        })

        this.add.text(100, 200, '2. Time limit: 2 minutes', {
            fontSize: '16px',
            fill: '#fff'
        })

        this.add.text(100, 240, '3. Bumping into sea creatires makes you lose hp', {
            fontSize: '16px',
            fill: '#fff'
        })

        this.add.text(100, 280, '4. Collecting chests adds a few seconds to the timer', {
            fontSize: '16px',
            fill: '#fff'
        })

        this.add.text(100, 320, '5. Collect coins for something interesting', {
            fontSize: '16px',
            fill: '#fff'
        })

        this.add.text(100, 360, '6. Game ends when time runs out or health reaches 0', {
            fontSize: '16px',
            fill: '#fff'
        })

        // Back button
        const backButton = this.add.text(100, 400, 'Back to Menu', {
            fontSize: '24px',
            fill: '#fff'
        }).setInteractive()

        // Add hover effect for back button
        backButton.on('pointerover', () => {
            backButton.setFill('#ff0'); // Change text color to yellow on hover
        })
        backButton.on('pointerout', () => {
            backButton.setFill('#fff'); // Reset text color on hover out
        })
        backButton.on('pointerdown', () => {
            this.scene.start('Menu'); // Go back to the Menu scene
        })
    }
}