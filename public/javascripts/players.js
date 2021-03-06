allPersonas = ['mike', 'tara', 'mario', 'fatty']

allPlayers = [];

// set huds for the players. this needs to be done better.
// this sets the default posision, then uses it to set the posisiton of the hud for the player.
var hudPosX = 16;
var hudPosY = 16;

function Player(persona){
    this.playerName = '';
    this.percent = 1;
    this.isLeft = false;
    this.persona = persona;
    this.avatar = "";
    this.hurt = false;
    this.hud = '';
    this.attacks = {punch: 1, kick: 1, airKick: 2, airPunch: 2, superPunch: 3, superKick: 3, special1: 4, special2: 4 };
    this.attackPercent ='';
    this.jumpCount = 0;
    this.isJumping = true;
    this.isDown = false;
    this.lives = 0;
    this.lastFrame = 0;
    this.hasItem = '';
};

Player.prototype.moveLeft = function() {
    if(this.avatar.body.touching.down){
        this.avatar.animations.play('walk');
    };

    this.isLeft = true;
    this.avatar.body.velocity.x = -150;
};

Player.prototype.moveRight = function() {
    if(this.avatar.body.touching.down){
        this.avatar.animations.play('walk');
    };
    this.isLeft = false;
    this.avatar.body.velocity.x = 150;
};

Player.prototype.punch = function() {
    if(!this.avatar.body.touching.down == true){
        this.avatar.animations.play('airPunch');
        this.attackPercent = this.attacks['airPunch'];

        player = this
        setTimeout(function(){
                player.avatar.animations.play('jump');
        }, 300);
    }
    else{
        this.attackPercent = this.attacks['punch'];
        this.avatar.animations.play('punch');
    }

    var player = this;

    for(var i = 0; i < allPlayers.length; i++){

        if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
            allPlayers[i].hurt = true;
           attackPlayer(this, allPlayers[i]);
        };
    };
};

Player.prototype.kick = function() {

    if(!this.avatar.body.touching.down == true){
        this.avatar.animations.play('airKick');
        this.attackPercent = this.attacks['airKick'];

        player = this
        setTimeout(function(){
                player.avatar.animations.play('jump');
        }, 300);
    }

    else{
        this.attackPercent = this.attacks['kick'];
        this.avatar.animations.play('kick');
    };

    var player = this;
    for(var i = 0; i < allPlayers.length; i++){

    if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
            allPlayers[i].hurt = true;
            attackPlayer(this, allPlayers[i]);
        };
    };
};


Player.prototype.superKick = function() {
    if(this.avatar.body.touching.down){
        this.attackPercent = this.attacks['superKick'];
        this.avatar.animations.play('superKick');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
                allPlayers[i].hurt = true;
               attackPlayer(this, allPlayers[i]);

            };
        };
    };
};


Player.prototype.superPunch = function() {
    if(this.avatar.body.touching.down){
        this.attackPercent = this.attacks['superPunch'];
        this.avatar.animations.play('superPunch');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
                allPlayers[i].hurt = true;
               attackPlayer(this, allPlayers[i]);
            };
        };
    };
};

Player.prototype.special1 = function() {
    if(this.avatar.body.touching.down){
        this.resetVelocity();
        this.attackPercent = this.attacks['special1'];
        this.avatar.animations.play('special1');
        var player = this;


        setTimeout(function() {
            for(var i = 0; i < allPlayers.length; i++){

                if(player.playerName != allPlayers[i].playerName && player.touching(allPlayers[i])){
                    allPlayers[i].hurt = true;
                   attackPlayer(player, allPlayers[i]);
                };

            };

        },500);

    };
};

Player.prototype.special2 = function() {
    if(this.avatar.body.touching.down){
        this.resetVelocity();
        this.attackPercent = this.attacks['special2'];
        this.avatar.animations.play('special2');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
                allPlayers[i].hurt = true;
               attackPlayer(this, allPlayers[i]);

            };
        };
    };
};

Player.prototype.jump = function() {
    this.avatar.body.velocity.y = -300;
    this.avatar.animations.play('jump');
};

Player.prototype.down = function() {
    if(this.avatar.body.touching.down){
        this.avatar.animations.play('down');
        this.isDown = true;
    }
    else{
        if(this.avatar.body.velocity.y > 300){
            this.avatar.body.velocity.y = 200
        }
        this.avatar.body.velocity.y += 1.5;
    }
};

Player.prototype.playerDead = function(level){
    if (this.lives != 0){
        var posX = this.avatar.body.x;
        var posY = this.avatar.body.y;
        if(posX < level.killZone.left|| posX > level.killZone.right || posY > level.killZone.top || posY < level.killZone.bottom){

            this.avatar.kill();
            this.percent = 0;
            this.lives -= 1;
            this.hud.text = this.playerName + ": " + 0 + "  Lives: "  + this.lives;
            this.avatar.allowGravity = false;
            this.resetVelocity();
            this.avatar.revive();
            this.avatar.body.x = 400;
            this.avatar.body.y = game.world.height -600;
            this.avatar.allowGravity = true;
            this.avatar.animations.play('stand');

        };
        return false;
    }
    else {
        return true
    }
};

Player.prototype.allKeysUp = function (){
    if(this.keyLeft.isUp && this.keyRight.isUp && this.keyJump.isUp && this.avatar.body.touching.down && this.keyKick.isUp && this.keySuperKick.isUp && this.keyPunch.isUp && this.keySuperPunch.isUp && this.keyDown.isUp){
        return true;
    }

    else{
        return false;
    }
}

Player.prototype.resetVelocity = function (){
    if(this.hurt == false){
        this.avatar.body.velocity.x = 0;
        this.avatar.body.velocity.y = 0;
    };
};

Player.prototype.touching = function (otherplayer){

    if (this.avatar.body.x  <= (otherplayer.avatar.body.x + 64) &&  otherplayer.avatar.body.x <= (this.avatar.body.x + 64)
            && this.avatar.body.y  <= (otherplayer.avatar.body.y + 64) &&  otherplayer.avatar.body.y <= (this.avatar.body.y + 64) ) {
        return true;
    }
    else {
        return false;
    }
};


Player.prototype.buildAnimations = function(){
    this.avatar.animations.add('stand', [0, 1, 2], 15, true);
    this.avatar.animations.add('walk', [4, 5, 6, 7, 8, 9, 10,11], 15, true);
    this.avatar.animations.add('jump', [14, 13, 12, 13], 12, false);
    this.avatar.animations.add('down', [3], 15, true);
    this.avatar.animations.add('punch', [17, 18, 17, 0], 15, false);
    this.avatar.animations.add('airPunch', [33, 34, 35, 35, 35, 35, 34, 33], 15, false);
    this.avatar.animations.add('superPunch', [19, 20, 21, 20, 19, 0], 15, false);
    this.avatar.animations.add('kick', [24, 25, 24, 0], 15, false);
    this.avatar.animations.add('airKick', [30, 31, 32, 32, 32, 32, 31, 30, ], 15, false);
    this.avatar.animations.add('superKick', [26, 27, 28, 29, 28, 27, 26, 0], 15, false);
    this.avatar.animations.add('special1', [36, 36, 36, 36, 37, 38, 39, 40], 15, false);
    this.avatar.animations.add('special2', [41, 42,43,43,43,42,41], 15, false);
    this.avatar.animations.add('hurt', [23, 22], 10, false);
};

Player.prototype.falling = function(){
    if (this.avatar.body.touching.down){
        this.jumpCount = 0;
    }
};

Player.prototype.checkMovement = function(){
    if (this.allKeysUp() && this.hurt == false){
        this.resetVelocity(this);
        this.avatar.frame = 0
    };

    if(this.keyLeft.isDown && this.keyPunch.isDown || this.keyRight.isDown && this.keyPunch.isDown){
        this.special1();
    }
    else if(this.keyLeft.isDown && this.keyKick.isDown || this.keyRight.isDown && this.keyKick.isDown){
        this.special2();
    }
    else{
        this.keyLeft.onDown.add(moveLeft.bind(this), this);
        this.keyRight.onDown.add(moveRight.bind(this), this);
        this.keyDown.onDown.add(down.bind(this), this);
        this.keySuperKick.onDown.add(superKick.bind(this), this);
        this.keySuperPunch.onDown.add(superPunch.bind(this), this);
        this.keyPunch.onDown.add(punch.bind(this), this);
        this.keyKick.onDown.add(kick.bind(this), this);
    };

    if(this.keyJump.isDown){
        this.isJumping = true;
        this.keyJump.onDown.add(jumpCheck.bind(this), this);
    };
};

Player.prototype.gotItem = function(){
    // add code to determin what happends when a player gets an item.
    console.log("got it");
};



// how to setup  players:

var lifesPerPerson = 2;
var player1 = new Player('guy');
player1.avatar.frame = 0
player1.playerName = 'Player 1'
allPlayers.push(player1);


// functions to intract with the players:

function buildPlayerControls(player){
    if (player.playerName == 'Player 1'){
      Player.prototype.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      Player.prototype.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      Player.prototype.keyJump = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      Player.prototype.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      Player.prototype.keyPunch = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
      Player.prototype.keyKick = game.input.keyboard.addKey(Phaser.Keyboard.M);
      Player.prototype.keySuperKick = game.input.keyboard.addKey(Phaser.Keyboard.N);
      Player.prototype.keySuperPunch = game.input.keyboard.addKey(Phaser.Keyboard.L);
    }
    // sets player 2 controls for now, but will be changed to be mre dynamic
    else {
      player.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
      player.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
      player.keyJump = game.input.keyboard.addKey(Phaser.Keyboard.W);
      player.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
      player.keyPunch = game.input.keyboard.addKey(Phaser.Keyboard.F);
      player.keyKick = game.input.keyboard.addKey(Phaser.Keyboard.G);
      player.keySuperKick = game.input.keyboard.addKey(Phaser.Keyboard.R);
      player.keySuperPunch = game.input.keyboard.addKey(Phaser.Keyboard.T);
    };
};

function buildHud(player){
    player.hud = game.add.text(hudPosX, hudPosY, player.playerName + ': 0  Lives: ' + player.lives, { fontSize: '12px', fill: '#000' });
    hudPosX += 250;
}


function checkFace(player){
    if (player.isLeft){
        player.avatar.scale.x = -1;
    }
    else {
       player.avatar.scale.x = 1;
    };
};

jumpCheck = function(){
    if(this.isJumping){
        if (this.jumpCount < 2){
            this.jump();
            this.jumpCount ++;
            this.isJumping = false;
        };
    };

};

// These are called from the update function in game.js
// this. is bound to the fucntion call, to make it the current player:

moveLeft = function(){
    this.moveLeft();
};
moveRight = function(){
    this.moveRight();
};

down = function(){
    this.down();
};

kick = function(){
    this.kick();
};

punch = function(){
    this.punch();
};

superKick = function(){
    this.superKick();
};
superPunch = function(){
    this.superPunch();
}

attackPlayer = function(attackingPlayer, hurtPlayer){

        checkFace(hurtPlayer)

        hurtPlayer.avatar.allowGravity = false;

        if (attackingPlayer.isLeft){
            hurtPlayer.isLeft = false;
            hurtPlayer.avatar.body.velocity.setTo (-(hurtPlayer.percent * 1.5), -(hurtPlayer.percent * 3));
        }
        else {
            hurtPlayer.isLeft = true;
            hurtPlayer.avatar.body.velocity.setTo ((hurtPlayer.percent * 1.5), -(hurtPlayer.percent * 3));
        }

        hurtPlayer.avatar.animations.play('hurt');

        updateHud(hurtPlayer);

        setTimeout(function() {
            hurtPlayer.percent += (attackingPlayer.attackPercent/ 150)
            hurtPlayer.avatar.body.velocity.x = 0;
            hurtPlayer.avatar.body.velocity.y = 0;
            hurtPlayer.avatar.allowGravity = true;
            hurtPlayer.hurt = false;

        },hurtWaitTimeout(hurtPlayer));

};

hurtWaitTimeout = function(hurtPlayer){
    if(hurtPlayer.percent < 50 ){
        return 200
    }
    else {
        return hurtPlayer.percent * 4
    };
}

updateHud = function(player){
    player.hud.text = player.playerName + ": " + Math.round(player.percent)  + "  Lives: "  + player.lives;

}


function buildPlayers(){
    for(var i = 0; i < allPlayers.length; i++){
        allPlayers[i].avatar = game.add.sprite(((i + 1)* 200), game.world.height - 510, allPlayers[i].persona);

        game.physics.enable(allPlayers[i].avatar, Phaser.Physics.ARCADE);
        allPlayers[i].avatar.anchor.setTo(.5, 1);
        allPlayers[i].avatar.body.bounce.setTo(0, 0.1);
        allPlayers[i].avatar.body.gravity.y = 400;
        allPlayers[i].avatar.body.width = 50;
        allPlayers[i].avatar.body.height = 100;
        // allPlayers[i].avatar.health = 0;
        allPlayers[i].buildAnimations();
        allPlayers[i].lives = lifesPerPerson;

        if(i%2 != 0){
            allPlayers[i].isLeft = true;
        }

        buildHud(allPlayers[i]);
        buildPlayerControls(allPlayers[i]);
    };
};

function restartGame() {
    for(var i = 0; i< allPlayers.length; i++){
        allPlayers[i].lives = lifesPerPerson;
        game.state.start(game.state.current);
    }
};