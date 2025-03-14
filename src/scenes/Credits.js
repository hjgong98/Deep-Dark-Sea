class Credits extends Phaser.Scene {
    constructor() {
        super("Credits")
    }
    
    preload () {
        // load images
        this.load.image('background', './assets/background.png')
    }

    create() {
        this.add.text(100, 100, 'Credits', { fontSize: '32px', fill: '#fff' })

        this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0,0)

        this.add.text(100, 150, 'background images drawn by me', {fontSize: '12px', fill: '#fff'})
        this.add.text(100, 200, 'sprites were drawn by me', {fontSize: '12px', fill: '#fff'})
        // https://freesound.org/people/akemov/sounds/255597/
        this.add.text(100, 250, 'underwater sound from\nhttps://freesound.org/people/akemov/sounds/255597/', {fontSize: '12px', fill: '#fff'})
        this.add.text(100, 300, 'chest opening sound from\nhttps://pixabay.com/sound-effects/short-success-sound-glockenspiel-treasure-video-game-6346/', {fontSize: '12px', fill: '#fff'})
        this.add.text(100, 350, 'player and sea creater thud sound from\nhttps://freesound.org/people/OwlStorm/sounds/209015/', {fontSize: '12px', fill: '#fff'})

        // back button
        let backButton = this.add.text(100, 400, 'Back to Menu', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}