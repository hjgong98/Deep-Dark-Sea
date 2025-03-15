class Controls extends Phaser.Scene {
    constructor() {
        super("Controls")
    }

    preload () {
        // load images
        this.load.image('background', './assets/background.png')
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0,0)

        this.add.text(100, 100, 'Instructions', { fontSize: '32px', fill: '#fff' })

        // control options
        let wasdOption = this.add.text(100, 200, 'WASD', { fontSize: '24px', fill: '#fff' }).setInteractive()
        let arrowsOption = this.add.text(100, 250, 'Arrows', { fontSize: '24px', fill: '#fff' }).setInteractive()
        let mouseOption = this.add.text(100, 300, 'Mouse', { fontSize: '24px', fill: '#fff' }).setInteractive()

        // events for controls
        wasdOption.on('pointerdown', () => this.selectControls('wasd'))
        arrowsOption.on('pointerdown', () => this.selectControls('arrows'))
        mouseOption.on('pointerdown', () => this.selectControls('mouse'))
    }
    
    selectControls(controlScheme) {
        // save the selected control scheme to the registry
        this.registry.set('controls', controlScheme)

        // return to the Menu scene
        this.scene.start('Menu')
    }
}