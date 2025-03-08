class Credits extends Phaser.Scene {
    constructor() {
        super("Credits")
    }

    create() {
        this.add.text(100, 100, 'Credits', { fontSize: '32px', fill: '#fff' })

        this.add.text(100, 200, 'background images drawn by me', {fontSize: '24px', fill: '#fff'})
        this.add.text(100, 250, 'sprites were drawn by me', {fontSize: '24px', fill: '#fff'})
        // https://freesound.org/people/akemov/sounds/255597/
        this.add.text(100, 300, 'underwater sound from https://freesound.org/people/akemov/sounds/255597/', {fontSize: '24px', fill: '#fff'})

        // back button
        let backButton = this.add.text(100, 400, 'Back to Menu', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}