// sea creatures prefab
class SeaCreatures extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, health, damage) {
        super(scene, x, y, texture, frame)
    
        // Add to scene and enable physics
        scene.add.existing(this)
        scene.physics.add.existing(this)
    
        // Sea creature properties
        this.health = health
        this.damage = damage
    }
    
    takeDamage(damage) {
        this.health -= damage
        this.health = Math.max(this.health, 0)

        console.log(`${this.texture.key} took ${damage} damage! Health: ${this.health}`)

        // Check if the sea creature is dead
        if (this.health === 0) {
            this.die()
        }
    }

    die() {
        this.destroy()
        console.log(`${this.texture.key} has been defeated!`)
    }
}