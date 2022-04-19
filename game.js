let game;

// game configuration
window.onload = function () {
  const gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0xb7cc1c,
    parent: "game",
    scale: {
      // mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 1300,
      height: 500,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 900,
        },
        debug: true,
      },
    },
    // 5 DIFFERENT SCENES
    scene: [
      // GameIntro,
      GamePlay,
      GameOver,
      // GameWin,
      GameHud,
    ],
  };
  // new game bruh
  game = new Phaser.Game(gameConfig);
  window.focus();
};

var tokenGreenOverlay;
var tokenYellowOverlay;
var tokenRedOverlay;
var tokenGreenTabGroup;
var tokenYellowTabGroup;
var tokenRedTabGroup;
var completedGreenMission = false;
var completedYellowMission = false;
var completedRedMission = false;

// GLOBAL GAME VARIABLES
let taiahaObj = {
  taiahaCollected: false,
  partsCollected: {
    taiahaHead: false,
    taiahaTongue: false,
    taiahaFront: false,
    taiahaBack: false,
  },
  taiahaPartsCollected: 0,
  totalTaiahaParts: 4,
};

let tongueTaiaha,
  headTaiaha,
  frontTaiaha,
  backTaiaha = null;

let taiahaCollected = false;
let tally = null;

let gameHeight = "";
let countdownTime = 0;

let keyF = null;

let enemyVelocity = 300;

let glowTween = null;

/* ======================
    GAME INTRO SCENE
=========================*/
class GameIntro extends Phaser.Scene {
  constructor() {
    super("game-intro");
  }
  // preloads for the intro scene
  preload() {
    this.load.image(
      "platform",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fground_grass.png?v=1603601137907"
    );
    // this.load.image("background", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fbg_layer1.png?v=1603601139028");
    this.load.image(
      "touchSides",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Ftouch-sides.png?v=1603601138715"
    );
    this.load.image(
      "kowhaiwhai",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkowhaiwhai.png?v=1609829230478"
    );
    this.load.image(
      "platformer-instructions",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fplatformer-instructions.png?v=1615280452997"
    );

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }
  // create for the intro scene
  create() {
    // background layers
    // this.add.image(240, 320, "background").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 5").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 4").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 3").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 2").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 1").setScrollFactor(1, 0);

    // kowhaiwhai pattern
    this.add
      .tileSprite(
        game.config.width / 2,
        game.config.height / 2 + 500,
        game.config.width,
        3000,
        "kowhaiwhai"
      )
      .setScrollFactor(0, 0.25)
      .setAlpha(0.2)
      .setScale(1);

    // dialog ONE (Using rexUI)
    this.dialog1 = this.rexUI.add
      .dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 500,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content: this.createLabel(
          this,
          "Find the keys to help unlock\nTāne's Action step tokens",
          50,
          50
        ),
        description: this.add.image(0, 0, "platformer-instructions"),
        actions: [this.createLabel(this, "NEXT", 10, 10)],
        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 20,
          content: 20,
          toolbarItem: 5,
          choice: 15,
          action: 15,
        },
        align: {
          center: "center",
          actions: "right", // 'center'|'left'|'right'
        },
        click: {
          mode: "release",
        },
      })
      .layout()
      // .drawBounds(this.add.graphics(), 0xff0000)
      .popUp(1000);

    // dialog TWO
    this.dialog2 = this.rexUI.add
      .dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 500,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content: this.createLabel(
          this,
          "Hold space button to jump.\nThe longer you hold space the higher Tāne can jump!",
          50,
          50
        ),
        // description:  this.add.image(0, 0, "platformer-instructions"),
        actions: [this.createLabel(this, "BEGIN", 10, 10)],
        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 20,
          content: 20,
          toolbarItem: 5,
          choice: 15,
          action: 15,
        },
        align: {
          content: "center",
          actions: "right", // 'center'|'left'|'right'
        },

        click: {
          mode: "release",
        },
      })
      .layout()
      // .drawBounds(this.add.graphics(), 0xff0000)
      .setVisible(false);

    var tween = this.tweens.add({
      targets: [this.dialog1, this.dialog2],
      scaleX: 1,
      scaleY: 1,
      ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      repeat: 0, // -1: infinity
      yoyo: false,
    });

    this.dialog1.on(
      "button.click",
      function (button) {
        if (button.text === "NEXT") {
          this.dialog1.setVisible(false);
          this.dialog2.setVisible(true).popUp(1000);
        }
      },
      this
    );

    this.dialog2.on(
      "button.click",
      function (button) {
        if (button.text === "BEGIN") {
          console.log("starting game");
          this.scene.start("game-play");
          // this.scene.start("game-hud")
        }
      },
      this
    );
  }
  // settings for the dialog labels
  createLabel(scene, text, spaceTop, spaceBottom) {
    return scene.rexUI.add.label({
      width: 40, // Minimum width of round-rectangle
      height: 40, // Minimum height of round-rectangle
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xffffff),
      text: scene.add.text(0, 0, text, {
        fontSize: "24px",
        color: "#533d8e",
        stroke: "#533d8e",
        strokeThickness: 2,
      }),
      space: {
        left: 10,
        right: 10,
        top: spaceTop,
        bottom: spaceBottom,
      },
    });
  }
  update() {}
}

/* ======================
    GAME OVER SCENE
=========================*/
class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }
  // propped in data
  init(data) {
    this.player = data.player;
  }
  // Game Over scene preload
  preload() {
    this.load.audio(
      "die",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-die.ogg?v=1603606001864",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fdie.ogg?v=1609829227262"
    );
    this.load.audio(
      "end-music",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fgameover-music.mp3?v=1609829224481"
    );

    this.load.image(
      "kowhaiwhai",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkowhaiwhai.png?v=1609829230478"
    );
  }
  // Game Over scene create
  create() {
    // destroy player
    this.player.destroy();

    taiahaObj.taiahaPartsCollected = 0;
    taiahaObj.taiahaCollected = false;
    // music
    this.scene.stop("game-hud");
    this.scene.stop("game-play");
    this.sound.stopAll();
    this.sound.play("die");
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: true,
      delay: 3000,
    };
    this.endMusic = this.sound.add("end-music", musicConfig);
    this.endMusic.play();

    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .tileSprite(
        game.config.width / 2,
        game.config.height / 2 + 500,
        game.config.width,
        3000,
        "kowhaiwhai"
      )
      .setScrollFactor(0, 0.25)
      .setAlpha(0.2)
      .setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
      active: () => {
        this.gameOver = this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 - 50,
            "Game Over",
            {
              fontFamily: "Freckle Face",
              fontSize: 50,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0);

        this.pressRestart = this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 + 50,
            "Press Space to Restart",
            {
              fontFamily: "Finger Paint",
              fontSize: 20,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true);
        this.pressRestart.setAlign("center");
        this.pressRestart.setOrigin();
        this.pressRestart.setScrollFactor(0);
      },
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game-play");
    });
  }
}

/* ======================
    GAME WIN SCENE
=========================*/
class GameWin extends Phaser.Scene {
  constructor() {
    super("game-win");
  }

  create() {
    this.scene.stop("game-hud");
    this.cameras.main.setBackgroundColor("#533d8e");

    this.sound.stopAll();
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: false,
      delay: 3000,
    };
    this.cheer = this.sound.add("cheer", musicConfig);
    this.cheer.play();

    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .tileSprite(
        game.config.width / 2,
        game.config.height / 2 + 500,
        game.config.width,
        3000,
        "kowhaiwhai"
      )
      .setScrollFactor(0, 0.25)
      .setAlpha(0.2)
      .setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
      active: () => {
        this.gameOver = this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 - 100,
            "You Win!",
            {
              fontFamily: "Freckle Face",
              fontSize: 50,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0);

        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2,
            "Tino pai to mahi.",
            {
              fontFamily: "Finger Paint",
              fontSize: 20,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0);
        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 + 100,
            "You collected all the actions\n to complete this moemoeā.",
            {
              fontFamily: "Finger Paint",
              fontSize: 20,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0);
      },
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game-play");
    });
  }
}

/* ======================
    GAME HUD SCENE
=========================*/
class GameHud extends Phaser.Scene {
  constructor() {
    super("game-hud");
  }
  init() {
    countdownTime = 120;
    this.totalTaiahaParts = 6;
    this.currentCoins = 0;
  }
  // Game hud preload
  preload() {
    this.load.spritesheet(
      "mauri1",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/fire2_64.png?v=1649479618044",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    this.load.spritesheet(
      "mauri2",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/fire6_64.png?v=1649479618111",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    this.load.spritesheet(
      "mauri3",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/fire7_64.png?v=1649479618218",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    this.load.image(
      "fire",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/blue-fire.png?v=1649480738676"
    );

    this.load.audio(
      "cheer",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fcheer.wav?v=1609829231162"
    );

    //  Load the Google WebFont Loader script
    this.load.script(
      "webfont",
      "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
    );

    // Taiaha Parts for the HUD
    this.load.image(
      "grey-taiaha",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/grey%20taiaha%202.png?v=1650343143905"
    );
    this.load.image(
      "tongue-taiaha",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/taiaha%20tongue.png?v=1649646916693"
    );
    this.load.image(
      "head-taiaha",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/taiaha%20head.png?v=1649646913292"
    );
    this.load.image(
      "front-taiaha",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/taiaha%20front.png?v=1649646907989"
    );
    this.load.image(
      "back-taiaha",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/taiaha%20back.png?v=1649646905020"
    );
  }
  // Game hud create
  create() {
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    // ====================== timer text =============================
    // load google font
    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
      active: () => {
        this.timer = this.add
          .text(game.config.width / 2, 50, "Time: " + countdownTime, {
            fontFamily: "Freckle Face",
            fontSize: 50,
            color: "#ffffff",
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.timer.setAlign("center");
        this.timer.setOrigin();
        // this.timer.setDepth(300)
        this.timer.setScrollFactor(0);

        this.time.addEvent({
          delay: 1000, // ms
          callback: this.loadTimer,
          //args: [],
          callbackScope: this,
          loop: true,
        });
      },
    });

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
      active: () => {
        tally = this.add
          .text(
            200,
            50,
            "Parts Collected: " +
              taiahaObj.taiahaPartsCollected +
              "/" +
              taiahaObj.totalTaiahaParts,
            {
              fontFamily: "Freckle Face",
              fontSize: 40,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true);
        tally.setAlign("center");
        tally.setOrigin();
      },
    });

    this.anims.create({
      key: "mauri1Anim",
      frames: "mauri1",
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: "mauri2Anim",
      frames: "mauri2",
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: "mauri3Anim",
      frames: "mauri3",
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: 'hedgehogRun',
      frames: 'hedgehogRun',
      frameRate: 12,
      repeat: -1
    })

    let taiahaScale = 0.4;

    let greyTaiaha = this.add.image(200, 80, "grey-taiaha");
    greyTaiaha.setScale(taiahaScale, taiahaScale);

    tongueTaiaha = this.add.image(200, 80, "tongue-taiaha");
    tongueTaiaha.setScale(taiahaScale, taiahaScale);
    tongueTaiaha.setVisible(false);

    headTaiaha = this.add.image(200, 80, "head-taiaha");
    headTaiaha.setScale(taiahaScale, taiahaScale);
    headTaiaha.setVisible(false);

    frontTaiaha = this.add.image(200, 80, "front-taiaha");
    frontTaiaha.setScale(taiahaScale, taiahaScale);
    frontTaiaha.setVisible(false);

    backTaiaha = this.add.image(200, 80, "back-taiaha");
    backTaiaha.setScale(taiahaScale, taiahaScale);
    backTaiaha.setVisible(false);
  }

  // ================ timer function ========================
  loadTimer() {
    var add = this.add;
    var input = this.input;

    if (countdownTime === 0) {
      console.log("end");
      this.scene.start("game-over");
    } else {
      countdownTime -= 1;
      this.timer.setText("Time: " + countdownTime);
    }
  }

  // method to be executed at each frame
  update() {}
}

/* ======================
    GAME PLAY SCENE   <<---- THIS IS THE ACTUAL GAME
=========================*/
class GamePlay extends Phaser.Scene {
  constructor() {
    super("game-play");
  }
  init() {
    this.scene.launch("game-hud");
    this.gotKeyYellow = false;
    this.gotKeyGreen = false;
    this.gotKeyRed = false;
    completedGreenMission = false;
    completedYellowMission = false;
    completedRedMission = false;
    this.jumptimer = 0;
    this.isOnPlatform = false;
    this.currentPlatform = null;
    this.attackFinished = false
  }
  preload() {
    // ====================== tilesheets =============================
    // spritesheets
    this.load.image(
      "ground",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_ground.png?v=1597798791918"
    );
    this.load.image(
      "tiles",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_tiles.png?v=1597798793579"
    );

    // ====================== images =============================
    // bridge asset
    this.load.image(
      "bridge",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FbridgeA.png?v=1600812709430"
    );

    // manu assets
    this.load.image(
      "kiwiCage",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/cage.png?v=1648393812074"
    );
    this.load.image(
      "kiwi",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/kiwi_idle.png?v=1648539380455"
    );

    // background assets
    this.load.image(
      "Layer 1",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%201.png?v=1648355031363"
    );
    this.load.image(
      "Layer 2",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%202.png?v=1648355106217"
    );
    this.load.image(
      "Layer 3",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%203.png?v=1648355112261"
    );
    this.load.image(
      "Layer 4",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%204.png?v=1648355125295"
    );

    // taiaha assets
    this.load.image(
      "taiaha-head-icon",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/ICON%20taiaha%20head.png?v=1649647763222"
    );
    this.load.image(
      "taiaha-tongue-icon",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/ICON%20taiaha%20tongue.png?v=1649648105935"
    );
    this.load.image(
      "taiaha-front-icon",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/ICON%20taiaha%20front.png?v=1649648109045"
    );
    this.load.image(
      "taiaha-back-icon",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/ICON%20taiaha%20back.png?v=1649648115969"
    );
    this.load.image(
      "taiaha-glow",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/taiaha-glow.png?v=1649904081002"
    );

    // floating platforms
    this.load.image(
      "grass-start",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/grass-start.png?v=1650343665394"
    );
    this.load.image(
      "grass",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/grass.png?v=1650343665394"
    );
    this.load.image(
      "grass-end",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/grass-end.png?v=1650343665542"
    );
    this.load.image(
      "moving-platform",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/floating-platform.png?v=1650347959424"
    );

    this.load.image(
      "enemy",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/enemy.png?v=1649904103930"
    );

    this.load.spritesheet('hedgehogRun', 
      'https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/hedgehog_run.png?v=1650364804031', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('hedgehogIdle', 'https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/hedgehog_idle.png?v=1650364806838')
    this.load.spritesheet(
      "magic",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/1_magicspell_spritesheet.png?v=1649481473924",
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );

    // TANE (From Ariki Creative)
    this.load.spritesheet(
      "taneIdle",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-idle.png?v=1606611069685",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "taneJump",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-jump.png?v=1606611070167",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "taneRun",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-run.png?v=1606611070188",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
    this.load.spritesheet(
      "taneAttack",
      "https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2F128-Attack%20Sprite.png?v=1602576237547",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
    this.load.spritesheet(
      "taneDeath",
      "https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2F128-Death-Sprite.png?v=1602576237169",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "kiwiIdle",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/kiwi-idle.png?v=1649057443589",
      {
        frameWidth: 128,
        frameHeight: 108,
      }
    );

    this.load.spritesheet(
      "kiwiRun",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/kiwi-walk.png?v=1649059409627",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "bee",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/bee-spritesheet-25x30.png?v=1650344750092",
      {
        frameWidth: 25,
        frameHeight: 30,
      }
    );

    // ====================== Tiled JSON map ===========================

    // OLIONI'S MAP
    // this.load.tilemapTiledJSON("map", "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/olioni-map-3.json?v=1650363170751")
    this.load.tilemapTiledJSON("map", "../map/olioni-map-3.json");

    // ====================== Sound effects ===========================
    this.load.audio(
      "hurt",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fbad.ogg?v=1609829228399"
    );
    this.load.audio(
      "good",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fgood.ogg?v=1609829222070"
    );
    this.load.audio(
      "maleJump1",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%202.wav?v=1649892575856"
    );
    this.load.audio(
      "maleJump2",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%203.wav?v=1649892576040"
    );
    this.load.audio(
      "maleJump3",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%204.wav?v=1649892575908"
    );
    this.load.audio(
      "maleJump4",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%205.wav?v=1649892576222"
    );
    this.load.audio(
      "maleJump5",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%206.wav?v=1649892576326"
    );
    this.load.audio(
      "maleJump6",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%207.wav?v=1649892576626"
    );
    this.load.audio(
      "maleJump7",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%208.wav?v=1649892576839"
    );
    this.load.audio(
      "maleJump8",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%209.wav?v=1649892577079"
    );
    this.load.audio(
      "maleJump9",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Jump%2010.wav?v=1649892577316"
    );
    this.load.audio(
      "whoosh",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/whoosh.wav?v=1650322824544"
    );
    // this.load.audio("ambience", "https://cdn.glitch.me/6ec21438-e8d9-4bed-8695-1a8695773d71/ambience.wav?v=1650322822754")
    this.load.audio(
      "music",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Dreamy-Love-Tai-Collective.mp3?v=1650322799783"
    );
    //  Load the Google WebFont Loader script
    this.load.script(
      "webfont",
      "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
    );
  }

  create() {
    // ====================== map =============================
    const map = this.make.tilemap({
      key: "map",
    });

    gameHeight = map.heightInPixels;

    this.sound.stopAll();
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: true,
      delay: 3000,
    };
    const ambienceConfig = {
      volume: 0.3,
      loop: true,
      delay: 3000,
    };
    const fxConfig = {
      volume: 1,
      loop: false,
      delay: 50,
    };
    this.music = this.sound.add("music", musicConfig);
    // this.ambience = this.sound.add("ambience", ambienceConfig)
    this.whoosh = this.sound.add("whoosh", fxConfig);

    // ====================== background =============================
    const bgScale = 2;
    const treeScale = 1.3;

    const bgXIndent = 0;
    const bgYIndent = 0;

    let bg_layer1 = this.add
      .image(bgXIndent, bgYIndent, "Layer 1")
      .setOrigin(0, 0); // BACKGROUND IMAGE LAYER
    let bg_layer2 = this.add
      .image(bgXIndent, bgYIndent, "Layer 2")
      .setOrigin(0, 0); // BACK TREES LAYER
    let bg_layer3 = this.add
      .image(bgXIndent, bgYIndent, "Layer 3")
      .setOrigin(0, 0); // DARK GREEN GRASS LAYER
    let bg_layer4 = this.add.image(bgXIndent, -70, "Layer 4").setOrigin(0, 0); // TREE LAYER

    bg_layer4.setScale(1.8, 3);
    bg_layer3.setScale(bgScale);
    bg_layer2.setScale(bgScale);
    bg_layer1.setScale(bgScale);

    bg_layer4.setScrollFactor(0.9, 0.9);
    bg_layer3.setScrollFactor(0.5, 0.3);
    bg_layer2.setScrollFactor(0.2);
    bg_layer1.setScrollFactor(0);
    // bg_layer4.setDepth()
    console.log("bg_layer4.widthInPixels", bg_layer4);
    // this.add.tileSprite(game.config.width/2, game.config.height/2, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0.1, 0).setAlpha(0.2).setScale(1);

    // ====================== tilesets =============================
    const groundTileset = map.addTilesetImage("spritesheet_ground", "ground");
    const detailTiles = map.addTilesetImage("spritesheet_tiles", "tiles");

    // ====================== MAP LAYERS =============================

    const mapScale = 0.4;
    const mapXIndent = 0;
    const mapYIndent = -230;

    //====================== Platforms =============================
    //-------- Tile Layers --------
    const platforms = map
      .createLayer("Platforms", groundTileset, mapXIndent, mapYIndent)
      .setOrigin(0, 0);
    const passthroughPlatforms = map
      .createLayer(
        "Platforms_passthrough",
        groundTileset,
        mapXIndent,
        mapYIndent
      )
      .setOrigin(0, 0);
    const bridges = map
      .createLayer("Bridge", detailTiles, mapXIndent, mapYIndent)
      .setOrigin(0, 0);
    // scale & collisions
    platforms.setScale(mapScale, mapScale);
    platforms.setCollisionByExclusion(-1, true);
    passthroughPlatforms.setScale(mapScale, mapScale);
    bridges.setScale(mapScale, mapScale);
    bridges.setCollisionByExclusion(-1, true);

    //-------- Object Layers --------

    // ====================== world physics =============================
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    // this.player.setCollideWorldBounds(true)

    // ====================== PLAYER =============================

    const playerScale = 1;
    const spawnIndent = 0.4;

    let spawnX = 0;
    let spawnY = 0;
    const spawn = map.findObject("Spawn", (obj) => {
      spawnX = obj.x;
      spawnY = obj.y;
      return obj;
    });

    // console.log(spawn)
    console.log("map", map.widthInPixels, map.heightInPixels);
    console.log("spawn", spawnX, spawnY);

    this.player = this.physics.add.sprite(
      spawnX * spawnIndent,
      spawnY * spawnIndent + mapYIndent,
      "taneIdle"
    );
    this.player.setBounce(0.01);
    this.player.setScale(playerScale, playerScale);
    this.player.setDepth(1000);
    this.player.body
      .setSize(this.player.width - 100, this.player.height - 50)
      .setOffset(50, 25);
    this.player.setFlipX(true);
    this.player.setDepth(500);

    // ====================== Camera ======================
    // this.cameras.main.setViewport(0, 0, map.widthInPixels, map.heightInPixels);
    console.log("map.heightInPixels*-0.25", map.heightInPixels * -0.25);
    this.cameras.main.setBounds(0, 0, 7000, 1200, true);
    // console.log(map.widthInPixels, map.heightInPixels)
    // Set camera follow player
    this.cameras.main.startFollow(this.player);
    // Set camera fade in
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    // this.cameras.main.setZoom(1);
    this.cameras.main.setFollowOffset(0, 0.25);

    // ========= TANE ANIMATIONS ===========
    this.anims.create({
      key: "taneRun",
      frames: this.anims.generateFrameNumbers("taneRun", {
        frames: [16, 17, 18, 19, 20, 21, 22, 23],
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "taneIdle",
      frames: this.anims.generateFrameNumbers("taneIdle", {
        frames: [6, 7, 8],
      }),
      frameRate: 5,
    });

    this.anims.create({
      key: "taneJump",
      frames: this.anims.generateFrameNumbers("taneJump", {
        frames: [12, 13, 14, 15],
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: "taneAttack",
      frames: this.anims.generateFrameNumbers("taneAttack", {
        frames: [8, 9, 10, 11],
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: "taneDie",
      frames: this.anims.generateFrameNumbers("taneDeath", {
        frames: [1, 2, 3, 4, 5],
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: "kiwiIdle",
      frames: this.anims.generateFrameNumbers("kiwiIdle", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "kiwiRun",
      frames: "kiwiRun",
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "magicAnim",
      frames: "magic",
      frameRate: 15,
    });

    this.anims.create({
      key: 'hedgehogRun',
      frames: 'hedgehogRun',
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: "bee",
      frames: "bee",
      frameRate: 15,
      repeat: -1,
    });
   
    // ========= Mauri flame HUD
    this.mauriLayer = this.add.layer().setDepth(1005);
    this.hudX = 750;

    // ====================== Controls ======================
    this.cursors = this.input.keyboard.createCursorKeys();

    // ====================== Object Layers =============================
    // Non-moving
    this.cagesObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.taiahaObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.playerMauriObjects = this.physics.add.group({
      allowGravity: false,
      immovable: false,
    });

    this.taiahaGlowObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.boundObjects = this.physics.add.group({
        allowGravity: false,
        immovable: true,
      })
      .setVisible(false);
    // Moving
    this.enemyObjects = this.physics.add.group({
      allowGravity: true,
      immovable: true,
    });
    this.kiwisObjects = this.physics.add.group({
      allowGravity: true,
      immovable: false,
    });
    this.movingPlatformObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.beeObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.mauri = this.playerMauriObjects
      .create(0, 0, "magic")
      .setOrigin(0, 0)
      .setDepth(1001)
      .setVisible(false);

    var cagesObjs = map.filterObjects(
      "Cages",
      (obj) => obj.type == "cage"
    );
    var kiwiObjs = map.filterObjects(
      "Birds",
      (obj) => obj.type == "kiwi"
    );
    
    var taiahaObjs = map.getObjectLayer("Tools").objects

    var hedgehogObjs = map.filterObjects(
      "Enemies",
      (obj) => obj.type == "hedgehog"
    );

    var beeObjs = map.filterObjects(
      "Enemies",
      (obj) => obj.type == "bee"
    );

    var boundObjs = map.createFromObjects("Bounds");

    var horizontalPlatformObjs = map.filterObjects(
      "Platforms_moving",
      (obj) => obj.type == "horizontal"
    );

    console.log("kiwiObjs", kiwiObjs);


    // ----- Bird Cages
    cagesObjs.forEach((cageObj) => {
      let cage = this.cagesObjects
        .create(
          cageObj.x * mapScale,
          cageObj.y * mapScale + mapYIndent,
          "kiwiCage"
        )
        .setOrigin(0, 0)
        .setScale(mapScale, mapScale);
      cage.name = cageObj.name;
      cage.type = cageObj.type;
      cage.setDepth(201);
      const cageCollider = this.physics.add.overlap(
        this.player,
        cage,
        this.touchingCage,
        null,
        this
      );
      cageCollider.name = cage.name;
    });

    // ----- Kiwis
    kiwiObjs.forEach((kiwiObj) => {
      let kiwi = this.kiwisObjects
        .create(kiwiObj.x * mapScale, kiwiObj.y * mapScale + mapYIndent, "kiwi")
        .setOrigin(0, 0)
        .setScale(0.5, 0.5);
      kiwi.body.setSize(kiwi.width - 30, kiwi.height - 50).setOffset(0, 13);
      this.physics.add.collider(kiwi, platforms);
      this.physics.add.collider(kiwi, bridges);
      kiwi.name = kiwiObj.name;
      kiwi.type = kiwiObj.type;
      kiwi.setDepth(200);
      kiwi.play("kiwiIdle", true);
    });

    let glowScale = 0.4;

    taiahaObjs.forEach((taiahaObj) => {
      let taiaha = null;
      if (taiahaObj.name == "head") {
        taiaha = this.taiahaObjects
          .create(
            taiahaObj.x * mapScale,
            taiahaObj.y * mapScale + mapYIndent,
            "taiaha-head-icon"
          )
          .setOrigin(0.5, 0.5)
          .setScale(mapScale, mapScale);
      } else if (taiahaObj.name == "tongue") {
        taiaha = this.taiahaObjects
          .create(
            taiahaObj.x * mapScale,
            taiahaObj.y * mapScale + mapYIndent,
            "taiaha-tongue-icon"
          )
          .setOrigin(0.5, 0.5)
          .setScale(mapScale, mapScale);
      } else if (taiahaObj.name == "front") {
        taiaha = this.taiahaObjects
          .create(
            taiahaObj.x * mapScale,
            taiahaObj.y * mapScale + mapYIndent,
            "taiaha-front-icon"
          )
          .setOrigin(0.5, 0.5)
          .setScale(mapScale, mapScale);
      } else if (taiahaObj.name == "back") {
        taiaha = this.taiahaObjects
          .create(
            taiahaObj.x * mapScale,
            taiahaObj.y * mapScale + mapYIndent,
            "taiaha-back-icon"
          )
          .setOrigin(0.5, 0.5)
          .setScale(mapScale, mapScale);
      }
      taiaha.name = taiahaObj.name;
      taiaha.type = taiahaObj.type;

      let glow = this.taiahaGlowObjects
        .create(
          taiahaObj.x * mapScale,
          taiahaObj.y * mapScale + mapYIndent,
          "taiaha-glow"
        )
        .setOrigin(0.5, 0.5)
        .setScale(glowScale, glowScale);
      glow.body.setSize(100, 100);

      taiaha.setDepth(401);
      glow.setDepth(400);

      this.tweens.add({
        targets: taiaha,
        y: taiahaObj.y * mapScale + mapYIndent + 20,
        duration: 2000,
        ease: "Sine.easeInOut",
        repeat: -1,
        yoyo: true,
      });
      this.tweens.add({
        targets: glow,
        y: taiahaObj.y * mapScale + mapYIndent + 20,
        duration: 2000,
        ease: "Sine.easeInOut",
        repeat: -1,
        yoyo: true,
      });
      this.tweens.add({
        targets: glow,
        scaleX: 0.6,
        scaleY: 0.6,
        duration: 1000,
        ease: "Sine.easeInOut",
        repeat: -1,
        yoyo: true,
      });
    });

    hedgehogObjs.forEach(enemyObj => {
      console.log('hedgehog')
      let enemy = null
      enemy = this.enemyObjects.create(enemyObj.x * mapScale, (enemyObj.y * mapScale) + mapYIndent, 'hedgehogIdle').setOrigin(0, 0).setScale(3, 3)
      enemy.body.setSize(((enemy.body.width) / 1.9), enemy.body.height / 3)
      enemy.name = enemyObj.name
      enemy.type = 'hedgehog'
      let random = Phaser.Math.Between(1, 2)
      switch(random) {
        case 1:
          enemy.body.velocity.x = -enemyVelocity
        case 2:
          enemy.body.velocity.x = enemyVelocity
      }
      console.log(enemy)
      enemy.play('hedgehogRun')
    });

    boundObjs.forEach((boundObj) => {
      let boundBox = this.boundObjects.create(boundObj.x * mapScale, (boundObj.y * mapScale) + mapYIndent, null).setOrigin(0, 0).setVisible(false)
      boundBox.setScale(1.55, 1.55)
      boundBox.body.setSize(boundBox.width + 4, boundBox.height)
      boundBox.setOffset(-2, 0)
      boundBox.x = (boundObj.x * mapScale - 24)
      boundBox.y = (((boundObj.y * mapScale) + mapYIndent) + 27)
      boundBox.name = boundObj.name
      boundBox.type = boundObj.type
    });

    // ----- Moving platforms
    horizontalPlatformObjs.forEach((movingPlatformObj) => {
      console.log('movingPlatformObj',movingPlatformObj);
      let movingPlatform = this.movingPlatformObjects
        .create(
          movingPlatformObj.x * mapScale,
          movingPlatformObj.y * mapScale + mapYIndent,
          "moving-platform"
        )
        .setOrigin(0.5, 0.5)
        .setScale(mapScale, mapScale);
      
      movingPlatform.name = movingPlatformObj.name;
      movingPlatform.type = movingPlatformObj.type;
      movingPlatform.setDepth(201);

      // tween animation of platform
      this.tweens.timeline({
        targets: movingPlatform,
        loop: -1,
        yoyo: true,
        tweens: [
          {
            x: movingPlatformObj.x * mapScale + 1000,
            duration: 4000,
            ease: "linear",
          },
        ],
        onUpdate: () => {
          movingPlatform.vx = movingPlatform.body.position.x - movingPlatform.previousX;
          movingPlatform.vy = movingPlatform.body.position.y - movingPlatform.previousY;
          movingPlatform.previousX = movingPlatform.body.position.x;
          movingPlatform.previousY = movingPlatform.body.position.y;
        },
      });
      //collider
      // player on platform
      this.physics.add.collider( this.player, movingPlatform, this.collisionMovingPlatform, this.isCollisionFromTop, this);
      // platform hits end box
      // this.physics.add.collider( movingPlatform, this.boundObjects,this.touchingBound, null, this);
    });

    // ----- Moving platforms
    beeObjs.forEach((beeObj, index) => {
      let bee = this.beeObjects
        .create(
          beeObj.x * mapScale,
          beeObj.y * mapScale + mapYIndent,
          "bee"
        )
        .setOrigin(0.5, 0.5)
        .setScale(1.5, 1.5)
        .play("bee")
      bee.name = beeObj.name;
      bee.type = beeObj.type;
      bee.setDepth(201);

      // // tween animation of platform
      // this.tweens.timeline({
      //   targets: bee,
      //   loop: -1,
      //   yoyo: true,
      //   tweens: [
      //     {
      //       y: beeObj.y * mapScale + mapYIndent + -200,
      //       duration: 2000,
      //       ease: "linear",
      //       startDelay: 100 * index
      //     },
      //   ],
      // });
      //collider
      this.physics.add.overlap( this.player, bee, this.touchingEnemy, null, this);
    });

    this.tweens.add({
      targets: this.beeObjects.getChildren(),
      y: 100,
      yoyo: true,
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      delay: this.tweens.stagger(1000)
  });



    // ====================== Colliders ======================
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, bridges);

    this.physics.add.collider(this.enemyObjects, platforms);
    this.physics.add.collider(this.enemyObjects, bridges);

    this.physics.add.collider(this.enemyObjects, this.boundObjects, this.touchingBound, null, this);

    //----- Key colliders/actions
    // this.physics.add.collider(this.player, this.levelObjects);
    this.physics.add.overlap(
      this.player,
      this.kiwisObjects,
      this.touchingKiwi,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.taiahaObjects,
      this.collectTaiaha,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.taiahaGlowObjects,
      this.touchingGlow,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemyObjects,
      this.touchingEnemy,
      null,
      this
    );

    // Add new key on the keyboard F, to use as attack button
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.playerAttacking = false;

    this.music.play(this.musicConfig);
    // this.ambience.play(this.ambienceConfig)
  }

  /* ================================
        Game-Play UPDATE
    ============================ */
  update() {
    // log player for testing
    // console.log('player x:',this.player.x,"y:",this.player.y);

    const playerJump = -370;
    const playerVelocity = 350;

    // ensures player sticks to moving platforms
    if (this.isOnPlatform && this.currentPlatform) {
      this.player.body.position.x += this.currentPlatform.vx;
      this.player.body.position.y += this.currentPlatform.vy;
      this.isOnPlatform = false;
      this.currentPlatform = null;
    }

    // if fallen
    if (this.player.y > 1300) {
      this.scene.start("game-over", { player: this.player });
    }

    // Control the player with left or right keys
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-playerVelocity);
      if (this.player.body.onFloor()) {
        this.player.play("taneRun", true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(playerVelocity);
      if (this.player.body.onFloor()) {
        this.player.play("taneRun", true);
      }
    } else {
      // If no keys are pressed, the player keeps still
      this.player.setVelocityX(0);
      // Only show the idle animation if the player is footed
      // If this is not included, the player would look idle while jumping
      if (this.player.body.onFloor() && this.playerAttacking == false) {
        this.player.play("taneIdle", false);
      }
    }
    if (this.player.body.velocity.x == 0) {
      if (taiahaObj.taiahaCollected == true && taiahaObj.taiahaPartsCollected >= 4) {
        if (keyF.isDown == true && this.player.body.onFloor() && this.playerAttacking == false) {
          this.whoosh.play(this.fxConfig)
          this.playerAttacking = true
          this.player.play('taneAttack', false)
          this.player.on('animationcomplete', (animation) => {
            if(animation.key == 'taneAttack') {
              this.playerAttacking = false
              this.attackFinished = true
            }
          })
        }
      } 
    }

    // Player can jump while walking any direction by pressing the space bar
    if (this.cursors.space.isDown && this.player.body.onFloor()) {
      //player is on the ground, so he is allowed to start a jump
      this.jumptimer = 1;
      this.player.body.velocity.y = playerJump;
      this.player.play("taneJump", false);
      const random = Phaser.Math.Between(1, 9);
      switch (random) {
        case 1:
          this.sound.play("maleJump1");
          break;
        case 2:
          this.sound.play("maleJump2");
          break;
        case 3:
          this.sound.play("maleJump3");
          break;
        case 4:
          this.sound.play("maleJump4");
          break;
        case 5:
          this.sound.play("maleJump5");
          break;
        case 6:
          this.sound.play("maleJump6");
          break;
        case 7:
          this.sound.play("maleJump7");
          break;
        case 8:
          this.sound.play("maleJump8");
          break;
        case 9:
          this.sound.play("maleJump9");
          break;
        default:
          return;
      }
    } else if (this.cursors.space.isDown && this.jumptimer != 0) {
      //player is no longer on the ground, but is still holding the jump key
      if (this.jumptimer > 15) {
        // player has been holding jump for over 30 frames, it's time to stop him
        this.jumptimer = 0;
        // this.player.play('taneJump', false);
      } else {
        // player is allowed to jump higher (not yet 30 frames of jumping)
        this.jumptimer++;
        this.player.body.velocity.y = playerJump;
        // this.player.play('taneJump', false);
      }
    } else if (this.jumptimer != 0) {
      //reset this.jumptimer since the player is no longer holding the jump key
      this.jumptimer = 0;
      // this.player.play('taneJump', false);
    }

    // flip player
    if (this.player.body.velocity.x > 0) {
      this.player.setFlipX(true);
    } else if (this.player.body.velocity.x < 0) {
      // otherwise, make them face the other side
      this.player.setFlipX(false);
    }
  }

  // Other custom game functions
  // ================ death function ========================
  playerHit(player, spike) {
    console.log("player was hit");
    let tw = this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      ease: "Linear",
      repeat: 5,
    });
    console.log("player died");
    // this.scene.start("game-over")
  }

  // ================ open lock function ========================
  reachedExit(player, exit) {
    this.scene.start("game-win");
  }

  // ===== CHECK CAGE FUNCTION =====
  touchingCage(player, cage) {
    if (
      taiahaObj.taiahaPartsCollected >= 4 &&
      taiahaObj.taiahaCollected == true &&
      player.body.velocity.x == 0
    ) {
      if (keyF.isDown) {
        const cageCollider = this.physics.world.colliders
          .getActive()
          .find(function (i) {
            return i.name == cage.name;
          });
        cageCollider.active = false;
        // show tane mauri animation
        this.mauri.setVisible(true);
        this.mauri.play("magicAnim", false);
        // add mauri flame
        this.addMauriFlame();

        cage.destroy()
        this.attackFinished == false
      }
    }
  }
  touchingKiwi(player, kiwi) {
    if (taiahaObj.taiahaCollected == true) {
      if (player.body.velocity.x == 0) {
        if (keyF.isDown) {
          console.log("go kiwi");
          kiwi.setVelocityX(-200);
          kiwi.play("kiwiRun", true);
        }
      }
    }
  }
  collectTaiaha(player, taiaha) {
    taiaha.destroy();
    taiahaObj.taiahaPartsCollected += 1;

    if (taiaha.name == "head") {
      headTaiaha.setVisible(true);
    } else if (taiaha.name == "tongue") {
      tongueTaiaha.setVisible(true);
    } else if (taiaha.name == "front") {
      frontTaiaha.setVisible(true);
    } else if (taiaha.name == "back") {
      backTaiaha.setVisible(true);
    }

    tally.setText(
      "Parts Collected: " +
        taiahaObj.taiahaPartsCollected +
        "/" +
        taiahaObj.totalTaiahaParts
    );

    if (taiahaObj.taiahaPartsCollected == 4) {
      console.log("ALL PARTS COLLECTED!");
      taiahaObj.taiahaCollected = true;
    }
  }
  touchingGlow(player, glow) {
    glow.destroy();
  }
  addMauriFlame() {
    this.hudX += 70;
    // add blue flame
    const mauriFlame = this.add
      .sprite(this.hudX, 50, "fire")
      .setScrollFactor(0)
      .setScale(2)
      .setDepth(1003);
    mauriFlame.play("mauri1Anim", true);
  }
  touchingEnemy(player, enemy) {
    this.scene.start("game-over", { player: player });
  }
  touchingBound(enemy, bound) {
    // was moving right
    if (enemy.body.velocity.x > 0 && enemy.body.velocity.y == 0) {
      enemy.body.velocity.x = -enemyVelocity;
    } 
    // was moving left
    else if (enemy.body.velocity.x < 0 && enemy.body.velocity.y == 0) {
      enemy.body.velocity.x = enemyVelocity;
    }
    // was moving up
    else if (enemy.body.velocity.y < 0 && enemy.body.velocity.x == 0) {
      enemy.body.velocity.y = -enemyVelocity;
    }
    // was moving up
    else if (enemy.body.velocity.y > 0 && enemy.body.velocity.x == 0) {
      enemy.body.velocity.y = enemyVelocity;
    }
    
    console.log('touching BOUND')
  }

  collisionMovingPlatform(sprite, platform) {
    if (platform.body.touching.up && sprite.body.touching.down) {
      this.isOnPlatform = true;
      this.currentPlatform = platform;
    }
  }

  //Only allow collisions from top
  isCollisionFromTop(sprite, platform) {
    return platform.body.y > sprite.body.y;
  }
}
