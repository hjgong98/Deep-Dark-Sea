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
    scene: [ Menu, Controls, Instructions, Objectives, Play, Achievements, Credits ]
}

let game = new Phaser.Game(config)

// set UI size
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// things to do: 3/13
// timer --- done
// sea creature and player interaction -- need to fix ---- WOORKING
// sea creature and player sound effect  -- done but not implemented
// save highest chest collected count and highest points scored in a single round -- done
// spinning coin that adds health -- wip -- done
// 3/14
// collecting chests == more seconds -- done