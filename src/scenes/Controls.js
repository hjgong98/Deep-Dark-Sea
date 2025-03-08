class Controls extends Phaser.Scene {
    constructor() {
        super("Controls")
    }

    create() {
        this.add.text(100, 100, 'Instructions', { fontSize: '32px', fill: '#fff' })

        // Control options
        let wasdOption = this.add.text(100, 200, 'WASD', { fontSize: '24px', fill: '#fff' }).setInteractive()
        let arrowsOption = this.add.text(100, 250, 'Arrows', { fontSize: '24px', fill: '#fff' }).setInteractive()
        let mouseOption = this.add.text(100, 300, 'Mouse', { fontSize: '24px', fill: '#fff' }).setInteractive()

        // events for controls
        wasdOption.on('pointerdown', () => this.selectControls('wasd'))
        arrowsOption.on('pointerdown', () => this.selectControls('arrows'))
        mouseOption.on('pointerdown', () => this.selectControls('mouse'))
    }
    
    selectControls(controlScheme) {
        // Save the selected control scheme to the registry
        this.registry.set('controls', controlScheme)

        // Return to the Menu scene
        this.scene.start('Menu')
    }
}