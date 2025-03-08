class Achievements extends Phaser.Scene {
    constructor() {
        super("Achievements")
    }

    create() {
        this.add.text(100, 100, 'Achievements', { fontSize: '32px', fill: '#fff' })

        

        // back button
        let backButton = this.add.text(100, 300, 'Back to Menu', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}