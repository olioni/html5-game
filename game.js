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
        debug: false,
      },
    },
    // 5 DIFFERENT SCENES
    scene: [
      GameIntro,
      GamePlay,
      // GameOver,
      // GameWin,
      GameHud,
    ],
  };
  // new game bruh
  game = new Phaser.Game(gameConfig);
  window.focus();
};

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
let platformVelocity = 200;

let glowTween = null;

let winText = null

let mauriCount = 0

/* ======================
    GAME INTRO SCENE
=========================*/
class GameIntro extends Phaser.Scene {
  constructor() {
    super({
      key: "game-intro",
      pack: {
        files: [
          {
            type: "plugin",
            key: "rexwebfontloaderplugin",
            url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js",
            start: true,
          },
          {
            type: "image",
            key: "tc-logo",
            url: "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/all%20white.png?v=1649980778495",
          },
        ],
      },
    });
  }
  // preloads for the intro scene
  preload() {

    //----- loading screen
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // "loading..." text
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 150,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    // "made by" text
    var madeByText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: "game by",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    madeByText.setOrigin(0.5, 0.5);

    // tai collective logo
    this.add
      .image(width / 2, height / 2 + 125, "tc-logo")
      .setDisplaySize(200, 200);

    // loading bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(game.config.width / 2 - 320 / 2, game.config.height / 2 - 100, 320, 50);

    // font plugin
    this.plugins.get("rexwebfontloaderplugin").addToScene(this);
    this.load.rexWebFont({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
    });

    this.load.image(
      "kowhaiwhai",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkowhaiwhai.png?v=1609829230478"
    );

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );

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

    // --------- preloads for hud game scene
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

    // --------- preloads for main game scene
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
      "background",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fbg_layer1.png?v=1603601139028"
    );
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
    this.load.image(
      "spikes",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspikes.png?v=1599014843516"
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
      "bee",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/bee-spritesheet-25x30.png?v=1650344750092",
      {
        frameWidth: 25,
        frameHeight: 30,
      }
    );
    this.load.spritesheet(
      "kiwiInCage",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/kiwi-idle-in-cage.png?v=1650368645983",
      {
        frameWidth: 128,
        frameHeight: 108,
      }
    );
    // DIFFERENT LOCKED UP BIRDS
    this.load.spritesheet("kiwiIdle", "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/kiwi-idle.png?v=1649057443589", {
      frameWidth: 128,
      frameHeight: 108,
    })
    this.load.spritesheet("kiwiRun", "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/kiwi-walk.png?v=1649059409627", {
      frameWidth: 128,
      frameHeight: 128,
    })
    this.load.spritesheet("tuiIdle", "../spritesheet/tui_idle.png", {
      frameWidth: 128,
      frameHeight: 128
    })
    this.load.spritesheet("tuiFlying", "../spritesheet/tui_flying.png", {
      frameWidth: 128,
      frameHeight: 128
    })
    this.load.spritesheet("huiaIdle", "../spritesheet/huia_breathing.png", {
      frameWidth: 128,
      frameHeight: 128
    })
    this.load.spritesheet("huiaFlying", "../spritesheet/huia_flying.png", {
      frameWidth: 128,
      frameHeight: 128
    })
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
    this.load.audio(
      "powerup",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/Retro%20Event%20StereoUP%2002.wav?v=1649892494671"
    );
    this.load.audio(
      "die",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/death.mp3?v=1649896854596"
    );
    this.load.audio(
      "dreamSound",
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/dream-sound.wav?v=1650243851542"
    );
    //  Load the Google WebFont Loader script
    this.load.script(
      "webfont",
      "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
    );

    // Pre-loader
    this.load.on("progress", function (value) {
      console.log(value);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        game.config.width / 2 - 300 / 2,
        game.config.height / 2 - 90,
        300 * value,
        30
      );
    });
    // this.load.on("fileprogress", function (file) {
    //   console.log(file.src);
    // });
    this.load.on("complete", function () {
      console.log("complete");
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }
  // create for the intro scene
  create() {

    // intro background
    this.add.image(game.config.width / 2, game.config.height / 2, "background").setOrigin(0.5, 0.5)

    this.anims.create({
      key: 'kiwiInCage',
      frames: 'kiwiInCage',
      frameRate: 6,
      repeat: -1
    })

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
        width: 200,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 10, 0x533d8e),
        content: this.createLabel(
          this,
          "Collect all 4 pieces of Tane's taiaha",
          20,
          20
        ),
        description: this.add.image(0, 0, "grey-taiaha").setDisplaySize(80, 40)
        ,
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
          description: 25,
          //  descriptionLeft: 200,
          //  descriptionRight: 200,
        },
        align: {
          content: "center",
          description: "center",
          actions: "right", // 'center'|'left'|'right'
        },
        click: {
          mode: "release",
        },
      })
      .layout()
      //  .drawBounds(this.add.graphics(), 0xff0000)
      .popUp(1000);

    // dialog TWO
    this.dialog2 = this.rexUI.add
      .dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 300,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content: this.createLabel(
          this,
          "So you can use the taiaha to free the trapped manu",
          10,
          10
        ),
        description: this.add.sprite(0, 0, "kiwiInCage").setScale(0.25).play("kiwiInCage").setDisplaySize(128, 108),
        actions: [this.createLabel(this, "START GAME", 10, 10)],
        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 20,
          content: 20,
          toolbarItem: 5,
          choice: 15,
          action: 15,
          descriptionLeft: 150,
          descriptionRight: 150,
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
      //  .drawBounds(this.add.graphics(), 0xff0000)
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
        if (button.text === "START GAME") {
          console.log("starting game");
          // this.scene.start("game-hud")
          this.scene.start("game-play");
        }
      },
      this
    );
  }
  // settings for the dialog labels
  // settings for the dialog labels
  createLabel(scene, text, spaceTop, spaceBottom) {
    return scene.rexUI.add.label({
      width: 40, // Minimum width of round-rectangle
      height: 40, // Minimum height of round-rectangle
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x8f80b6),
      text: scene.add
        .text(0, 0, text, {
          fontFamily: "Freckle Face",
          fontSize: "24px",
          color: "#ffffff",
        })
        .setShadow(2, 2, "#333333", 2, false, true)
        .setAlign("center"),
      space: {
        left: 10,
        right: 10,
        top: spaceTop,
        bottom: spaceBottom,
      },
    });
  }
  update() { }
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
      "https://cdn.glitch.global/d000a9ec-7a88-4c14-9cdd-f194575da68e/death.mp3?v=1649896854596"
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
    WebFont.load({
      google: { families: ["Freckle Face", "Finger Paint", "Nosifer"] }
    })
    winText = this.add.text(game.config.width / 2, game.config.height / 2, "Nga Mihi Tane! For freeing all the birds you have earned another piece of your dream!", {
      fontFamily: "Freckle Face",
      fontSize: 50,
      color: '#ffffff'
    }).setShadow(2, 2, "#333333", 2, false, true)
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
    // hud assets preloaded already in game-intro
  }
  // Game hud create
  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);
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
  update() { }
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
    this.jumptimer = 0;
    this.isOnPlatform = false;
    this.currentPlatform = null;
    this.attackFinished = false
    this.movingPlatform = null
    this.previousBounds = {}
  }
  preload() {

  }

  create() {
    this.scene.stop("game-intro");
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

    // this.music.play(this.musicConfig);
    // this.ambience.play(this.ambienceConfig)

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
    this.cameras.main.fadeIn(500, 0, 0, 0);
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
      key: "tuiIdle",
      frames: "tuiIdle",
      frameRate: 3,
      repeat: -1
    })
    this.anims.create({
      key: 'tuiFlying',
      frames: 'tuiFlying',
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'huiaIdle',
      frames: 'huiaIdle',
      frameRate: 3,
      repeat: -1
    })
    this.anims.create({
      key: 'huiaFlying',
      frames: 'huiaFlying',
      frameRate: 10,
      repeat: -1
    })

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
    this.spikeObjects = this.physics.add.group({
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
    this.birdsObjects = this.physics.add.group({
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
    var tuiObjs = map.filterObjects(
      "Birds",
      (obj) => obj.type == "tui"
    )
    var huiaObjs = map.filterObjects(
      "Birds",
      (obj) => obj.type == "huia"
    )

    var taiahaObjs = map.getObjectLayer("Tools").objects

    var hedgehogObjs = map.filterObjects(
      "Enemies",
      (obj) => obj.type == "hedgehog"
    );

    var beeObjs = map.filterObjects(
      "Enemies",
      (obj) => obj.type == "bee"
    );
    var beeVerticalObjs = map.filterObjects(
      "Enemies",
      (obj) => obj.type == "beeV"
    );

    var boundObjs = map.getObjectLayer("Bounds");
    var spikeObjs = map.getObjectLayer('Spikes');

    var horizontalPlatformObjs = map.filterObjects(
      "Platforms_moving",
      (obj) => obj.type == "horizontal"
    );
    var verticalPlatformObjs = map.filterObjects(
      "Platforms_moving",
      (obj) => obj.type == "vertical"
    );

    console.log("verticalPlatformObjs", verticalPlatformObjs);


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
      let kiwi = this.birdsObjects
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

    tuiObjs.forEach((tuiObj) => {
      let tui = this.birdsObjects.create(tuiObj.x * mapScale, tuiObj.y * mapScale + mapYIndent, "tuiIdle").setOrigin(0, 0).setScale(mapScale, mapScale);
      // tui.body.setSize(tui.width - 30, tui.height - 25).setOffset(0, 13);
      tui.body.setSize(tui.width, tui.height - 22)
      this.physics.add.collider(tui, platforms);
      this.physics.add.collider(tui, bridges);
      tui.name = tuiObj.name;
      tui.type = tuiObj.type;
      tui.setDepth(200);
      tui.play("tuiIdle", true);
    });

    huiaObjs.forEach((huiaObj) => {
      let huia = this.birdsObjects.create(huiaObj.x * mapScale, huiaObj.y * mapScale + mapYIndent, "huiaIdle").setOrigin(0, 0).setScale(mapScale, mapScale);
      // tui.body.setSize(tui.width - 30, tui.height - 25).setOffset(0, 13);
      huia.body.setSize(huia.width, huia.height - 50).setOffset(0, 40)
      this.physics.add.collider(huia, platforms);
      this.physics.add.collider(huia, bridges);
      huia.name = huiaObj.name;
      huia.type = huiaObj.type;
      huia.setDepth(200);
      huia.play("huiaIdle", true);
    });
    // ----- Spikes
    spikeObjs.objects.forEach(spikeObject => {
      let spike = this.spikeObjects.create(spikeObject.x * mapScale,
        spikeObject.y * mapScale + mapYIndent, 'spikes').setScale(mapScale).setOrigin(0, 1)
      spike.body.setSize(spike.width, spike.height - 60).setOffset(0, 60);
      this.physics.add.collider(this.player, spike, this.touchingEnemy, null, this);
    })


    // ----- Taiaha
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

      let enemy = null
      enemy = this.enemyObjects.create(enemyObj.x * mapScale, (enemyObj.y * mapScale) + mapYIndent, 'hedgehogIdle').setOrigin(0, 0).setScale(3, 3)
      enemy.body.setSize(((enemy.body.width) / 1.9), enemy.body.height / 3)
      enemy.name = enemyObj.name
      enemy.type = 'hedgehog'
      let random = Phaser.Math.Between(1, 2)
      switch (random) {
        case 1:
          enemy.body.velocity.x = -enemyVelocity
        case 2:
          enemy.body.velocity.x = enemyVelocity
      }

      enemy.play('hedgehogRun')
    });

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
      bee.setDepth(202);
      this.physics.add.overlap(this.player, bee, this.touchingEnemy, null, this);
    });
    // bee tween
    this.tweens.add({
      targets: this.beeObjects.getChildren(),
      y: 100,
      yoyo: true,
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      delay: this.tweens.stagger(1000)
    });
    // vertical moving bees
    beeVerticalObjs.forEach((beeObj, index) => {
      let beeV = this.beeObjects
        .create(
          beeObj.x * mapScale,
          beeObj.y * mapScale + mapYIndent,
          "bee"
        )
        .setOrigin(0.5, 0.5)
        .setScale(1.5, 1.5)
        .play("bee")
      beeV.name = beeObj.name;
      // create obj in previousBound to store previous hit bound for this beeV
      this.previousBounds[beeV.name] = { previous: "" }
      beeV.type = beeObj.type;
      beeV.setDepth(202);

      let random = Phaser.Math.Between(1, 2)
      let randomSpeed = Phaser.Math.Between(150, 450)
      switch (random) {
        case 1:
          beeV.body.velocity.y = -enemyVelocity
        case 2:
          beeV.body.velocity.y = enemyVelocity
      }

      this.physics.add.overlap(this.player, beeV, this.touchingEnemy, null, this);
      // passing in previousBounds and randomSpeed as variables to collider callback
      this.physics.add.collider(beeV, this.boundObjects, this.beeVTouchingBound, null, { this: this, previousBounds: this.previousBounds, randomSpeed: randomSpeed });
    });


    boundObjs.objects.forEach((boundObj) => {
      let boundBox = this.boundObjects.create(boundObj.x * mapScale, (boundObj.y * mapScale) + mapYIndent, null).setOrigin(0, 0).setVisible(false)
      boundBox.setScale(1.5, 1.5)
      boundBox.body.setSize(boundBox.width + 8, boundBox.height)
      boundBox.setOffset(-4, 0)
      // boundBox.x = (boundObj.x * mapScale - 24)
      // boundBox.y = (((boundObj.y * mapScale) + mapYIndent) + 27)
      boundBox.name = boundObj.name
      boundBox.type = boundObj.type
    });

    // ----- Moving platforms
    verticalPlatformObjs.forEach((movingPlatformObj) => {

      let movingVerticalPlatform = this.movingPlatformObjects
        .create(
          movingPlatformObj.x * mapScale,
          movingPlatformObj.y * mapScale + mapYIndent,
          "moving-platform"
        )
        .setOrigin(0.5, 0.5)
        .setScale(mapScale * 0.5, mapScale * 0.5);

      movingVerticalPlatform.name = movingPlatformObj.name;
      this.previousBounds[movingVerticalPlatform.name] = { previous: "" }
      movingVerticalPlatform.type = movingPlatformObj.type;
      movingVerticalPlatform.setDepth(201);

      let random = Phaser.Math.Between(1, 2)
      let randomSpeed = Phaser.Math.Between(150, 350)
      switch (random) {
        case 1:
          movingVerticalPlatform.body.velocity.y = -randomSpeed
        case 2:
          movingVerticalPlatform.body.velocity.y = randomSpeed
      }
      //collider
      // player on platform
      this.physics.add.collider(this.player, movingVerticalPlatform, this.collisionMovingPlatform, this.isCollisionFromTop, this);
      // passing in previousBounds and randomSpeed as variables to collider callback
      this.physics.add.collider(movingVerticalPlatform, this.boundObjects, this.platformVTouchingBound, null, { this: this, previousBounds: this.previousBounds, randomSpeed: randomSpeed });
    });

    horizontalPlatformObjs.forEach((movingPlatformObj) => {
      console.log('movingPlatformObj', movingPlatformObj);
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

      // let random = Phaser.Math.Between(1, 2)
      // switch (random) {
      //   case 1:
      //     movingPlatform.body.velocity.x = -platformVelocity
      //   case 2:
      //     movingPlatform.body.velocity.x = platformVelocity
      // }

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
      this.physics.add.collider(this.player, movingPlatform, this.collisionMovingPlatform, this.isCollisionFromTop, this);
      // platform hits end box
      // this.physics.add.collider( movingPlatform, this.boundObjects,this.touchingBound, null, this);
    });






    // ====================== Colliders ======================
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, bridges);

    this.physics.add.collider(this.enemyObjects, platforms);
    this.physics.add.collider(this.enemyObjects, bridges);

    // bounds colliders
    this.physics.add.collider(this.enemyObjects, this.boundObjects, this.touchingBound, null, this);
    this.physics.add.collider(this.movingPlatformObjects, this.boundObjects, this.platformTouchingBound, null, this);

    //----- Key colliders/actions
    // this.physics.add.collider(this.player, this.levelObjects);
    this.physics.add.overlap(this.player, this.birdsObjects, this.touchingBird, null, this);
    this.physics.add.overlap(this.player, this.taiahaObjects, this.collectTaiaha, null, this);
    this.physics.add.overlap(this.player, this.taiahaGlowObjects, this.touchingGlow, null, this);
    this.physics.add.overlap(this.player, this.enemyObjects, this.touchingEnemy, null, this);

    // Add new key on the keyboard F, to use as attack button
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.playerAttacking = false;

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
      console.log("current platform type = ", this.currentPlatform.type)
      if (this.currentPlatform.type == "vertical") {
        // this.movingPlatform = this.currentPlatform
        this.currentPlatform.vx = this.currentPlatform.body.position.x - this.currentPlatform.previousX;
        this.currentPlatform.vy = this.currentPlatform.body.position.y - this.currentPlatform.previousY;
        this.currentPlatform.previousX = this.currentPlatform.body.position.x;
        this.currentPlatform.previousY = this.currentPlatform.body.position.y;
        // in the first instance there is no previousXY so return if NaN
        if (isNaN(this.currentPlatform.vx)) return
        // make playert xy change relative to movement of platforms
        this.player.body.position.x += this.currentPlatform.vx;
        // this.player.body.position.y += this.movingPlatform.vy;
        this.isOnPlatform = false;
        this.currentPlatform = null;
      } else {
        this.player.body.position.x += this.currentPlatform.vx;
        this.player.body.position.y += this.currentPlatform.vy;

        this.isOnPlatform = false;
        this.currentPlatform = null;
      }
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
            if (animation.key == 'taneAttack') {
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
  touchingBird(player, bird) {
    if (taiahaObj.taiahaCollected == true) {
      if (player.body.velocity.x == 0) {
        if (keyF.isDown) {
          let random = Phaser.Math.Between(1, 2)
          if (bird.type == "kiwi") {
            console.log("go kiwi");
            if (random == 1) { bird.setVelocityX(-200); } else { bird.setVelocityX(200) }
            if (bird.body.velocity.x == 200) { bird.setFlipX(true) } else { bird.setFlipX(false) }
            bird.play("kiwiRun", true);
          } else if (bird.type == "tui") {
            console.log("go tui")
            bird.play("tuiFlying", true)
            this.tweens.add({
              targets: bird,
              x: bird.body.x - bird.body.x,
              y: bird.body.y - bird.body.y,
              duration: 4000,
              ease: 'Sine.easeInOut',
              onComplete: function (tween) {
                tween.targets[0].destroy()
                console.log('target destroyed')
              }
            })
          } else if (bird.type == "huia") {
            console.log("go huia")
            bird.play("huiaFlying", true)
            this.tweens.add({
              targets: bird,
              x: bird.body.x - bird.body.x,
              y: bird.body.y - bird.body.y,
              duration: 4000,
              ease: 'Sine.easeInOut',
              onComplete: function (tween) {
                tween.targets[0].destroy()
                console.log('target destroyed')
              }
            })
          }
        }
      }
    }
  }
  collectTaiaha(player, taiaha) {
    taiaha.destroy();
    taiahaObj.taiahaPartsCollected += 1;
    this.sound.play("powerup");

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
    mauriCount += 1
    if (mauriCount == 6) {
      console.log('ALL KIWIS FREED! ALL MAURI COLLECTED!')
      this.finishGame()
    }
  }
  touchingEnemy(player, enemy) {
    // this.scene.start("game-over", { player: player });
  }
  touchingBound(enemy, bound) {
    // was moving right
    if (enemy.body.velocity.x > 0 && enemy.body.velocity.y == 0) {
      enemy.body.velocity.x = -enemyVelocity;
      enemy.setFlipX(true);
    }
    // was moving left
    else if (enemy.body.velocity.x <= 0 && enemy.body.velocity.y == 0) {
      enemy.body.velocity.x = enemyVelocity;
      enemy.setFlipX(false);
    }
    // was moving up
    else if (enemy.body.velocity.y < 0 && enemy.body.velocity.x == 0) {
      enemy.body.velocity.y = enemyVelocity;

    }
    // was moving up
    else if (enemy.body.velocity.y > 0 && enemy.body.velocity.x == 0) {
      enemy.body.velocity.y = -enemyVelocity;
    }
  }
  beeVTouchingBound(enemy, bound) {

    // check previous for this enemy
    if (bound.name == this.previousBounds[enemy.name].previous) return

    // was moving up
    if (enemy.body.velocity.y <= 0 && enemy.body.velocity.x == 0) {

      // enemy.body.velocity.y = enemyVelocity;
      enemy.body.velocity.y = this.randomSpeed;
    }
    // was moving up
    else if (enemy.body.velocity.y > 0 && enemy.body.velocity.x == 0) {
      // enemy.setVelocityY(0)
      // enemy.body.velocity.y = -enemyVelocity;
      enemy.body.velocity.y = -this.randomSpeed;
    }

    this.previousBounds[enemy.name].previous = bound.name

  }
  platformTouchingBound(platform, bound) {
    //make sure its not same as previous bound

    // was moving right
    if (platform.body.velocity.x > 0 && platform.body.velocity.y == 0) {
      platform.body.velocity.x = -platformVelocity;
    }
    // was moving left
    else if (platform.body.velocity.x <= 0 && platform.body.velocity.y == 0) {
      platform.body.velocity.x = platformVelocity;
    }
    // was moving up
    else if (platform.body.velocity.y < 0 && platform.body.velocity.x == 0) {
      platform.body.velocity.y = platformVelocity;
    }
    // was moving up
    else if (platform.body.velocity.y > 0 && platform.body.velocity.x == 0) {
      platform.body.velocity.y = -platformVelocity;
    }

  }
  platformVTouchingBound(platform, bound) {
    //make sure its not same as previous bound
    if (bound.name == this.previousBounds[platform.name].previous) return

    // was moving up
    if (platform.body.velocity.y < 0 && platform.body.velocity.x == 0) {
      platform.body.velocity.y = this.randomSpeed;
    }
    // was moving up
    else if (platform.body.velocity.y > 0 && platform.body.velocity.x == 0) {
      platform.body.velocity.y = -this.randomSpeed;
    }

    this.previousBounds[platform.name].previous = bound.name
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

  finishGame() {
    this.scene.start('game-win')
    this.scene.stop('game-start')
    this.scene.stop('game-hud')
  }
}
