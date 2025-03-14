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

// things to do: (remove once done)
// timer
// sea creature and player interaction
// sea creature and player sound effect  -- done
// save highest chest collected count and highest points scored in a single round -- done
// check for new high scores and if both are new high scores, ask for name to display on leaderboard
// spinning coin that adds health