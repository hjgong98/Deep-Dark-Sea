let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    zoom: 2,
    scene: [ Menu, Controls, Instructions, Sprites, Play, Achievements, Credits ]
}

let game = new Phaser.Game(config)

// set UI size
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard binding