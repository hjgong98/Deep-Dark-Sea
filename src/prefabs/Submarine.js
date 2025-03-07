// submarine prefab
class Submarine extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame)  {
        super(scene, x, y, texture, frame) 

        // add object to existing scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // submarine properties
        this.moveSpeed = 200
        this.health = 10
        this.isAlive = true

        // if sea creature is octopus, damage = 1, hp = 5
        // if sea creature is squid1 or squid2, damage = 2, hp = 10
        this.body.setCollideWorldBounds(true)
    }

    update(cursors) {
        if (!this.isAlive) return

        // Reset velocity
        this.setVelocity(0)

        // Horizontal movement with boundary checks
        if (cursors.left.isDown && this.x >= this.borderUISize + this.width / 2) {
            this.setVelocityX(-this.moveSpeed)
        } else if (cursors.right.isDown && this.x <= this.gameWidth - this.borderUISize - this.width / 2) {
            this.setVelocityX(this.moveSpeed)
        }

        // Vertical movement with boundary checks
        if (cursors.up.isDown && this.y >= this.borderUISize + this.height / 2) {
            this.setVelocityY(-this.moveSpeed)
        } else if (cursors.down.isDown && this.y <= this.gameHeight - this.borderUISize - this.height / 2) {
            this.setVelocityY(this.moveSpeed)
        }

        // Normalize diagonal movement (optional)
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
            this.body.velocity.normalize().scale(this.moveSpeed)
        }
    }

    takeDamage(damage) {
        if (!this.isAlive) return

        this.health -= damage
        this.health = Math.max(this.health, 0)

        console.log(`Submarine took ${damage} damage! Health: ${this.health}`)

        // Check if the submarine is dead
        if (this.health === 0) {
            this.die();
        }
    }

    die() {
        this.isAlive = false
        this.setVisible(false)
        console.log('Submarine has been destroyed!')
    }
}