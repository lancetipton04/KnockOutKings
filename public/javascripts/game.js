var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'public/images/sky.png');
    game.load.image('ground', 'public/images/platform.png');
    game.load.image('star', 'public/images/star.png');
    game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);

}

allPlayers = [];

function killZone(){
    this.top = 800 + 250;
    this.bottom = -(800 - 250);
    this.left = -(600 - 250);
    this.right = 600 + 250;
}

var killZone = new killZone();


function Player(){
    this.playerName = ''
    this.percent = 1;
    this.isLeft = false;
    this.guy = "";
    this.hurt = false;
    this.hud = '';
    this.attacks = {punch: 1, kick: 1, superPuch: 2, superKick: 2};
    this.attackPercent ='';
    this.jumpOne = false;
    this.jumpTwo = false;
    this.lastFrame = 0;
    this.lives = 0;
};

Player.prototype.moveLeft = function() {
        this.isLeft = true;
        this.guy.body.velocity.x = -150;
        this.guy.animations.play('walk');
};

Player.prototype.moveRight = function() {
        this.isLeft = false;
        this.guy.body.velocity.x = 150;
        this.guy.animations.play('walk');
};

Player.prototype.superKick = function() {
        this.attackPercent = this.attacks['superKick'];
        this.guy.animations.play('superKick');
        this.lastFrame = 34;
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && touching(player, allPlayers[i])){
                playerHurt(allPlayers[i], player);
            };
        };
};

Player.prototype.jump = function() {
        if(!this.jumpOne){
            this.guy.frame = 13;
            this.guy.body.velocity.y = -300;
            this.lastFrame = 13;
            this.jumpOne = true;
        }
        else if(this.jumpOne && !this.jumpTwo){
            this.guy.frame = 13;
            this.guy.body.velocity.y = -300;
            this.lastFrame = 13;
            this.jumpTwo = true;
        };
};

Player.prototype.punch = function() {
        this.attackPercent = this.attacks['punch'];

        this.guy.animations.play('punch');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && touching(player, allPlayers[i])){
                playerHurt(allPlayers[i], player);
            };
        };
};

Player.prototype.kick = function() {
        this.attackPercent = this.attacks['kick'];

        if (this.guy.body.touching.down){
            this.guy.animations.play('kick');
        }
        else {
            this.guy.animations.play('airKick');
            this.lastFrame = 35;

            setTimeout(function(){
                this.lastFrame = 13;
            }, 200)
        };
        var player = this;
        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && touching(player, allPlayers[i])){
                playerHurt(allPlayers[i], player);
            };
        };
};

var lifesPerPerson = 2;

var player1 = new Player();
player1.playerName = 'Player 1'
player1.lives = lifesPerPerson;

var player2 = new Player();
player2.playerName = 'Player 2'
player2.lives = lifesPerPerson;

allPlayers.push(player1);
allPlayers.push(player2);


function create() {

    Player.prototype.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    Player.prototype.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    Player.prototype.keyJump = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    Player.prototype.keyPunch = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
    Player.prototype.keyKick = game.input.keyboard.addKey(Phaser.Keyboard.M);
    Player.prototype.keySuperKick = game.input.keyboard.addKey(Phaser.Keyboard.N);



    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(200, game.world.height - 100, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)


    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(600, 300, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 200, 'ground');
    ledge.body.immovable = true;

    // The player1 and its settings
    player1.guy = game.add.sprite(250, game.world.height - 110, 'guy');
    player1.guy.anchor.setTo(.5, 1);

    player2.guy = game.add.sprite(300, game.world.height - 110, 'guy');
    player2.guy.anchor.setTo(.5, 1);
    //  We need to enable physics on the player1
    game.physics.enable(player1.guy, Phaser.Physics.ARCADE);
    game.physics.enable(player2.guy, Phaser.Physics.ARCADE);

    //  Player1 physics properties. Give the little guy a slight bounce.
    player1.guy.body.bounce.setTo(0.1, 0.1);
    player1.guy.body.gravity.y = 200;
    // player1.guy.body.collideWorldBounds = true;

    player2.guy.body.bounce.setTo(0.1, 0.1);
    player2.guy.body.gravity.y = 200;
    // player2.guy.body.collideWorldBounds = true;

    //  Our two animations, walking left and right, next number is frames per second


    player1.guy.animations.add('walk', [4, 5, 6, 7, 8, 9, 10,11], 10, true);
    player1.guy.animations.add('punch', [18], 10, true);
    player1.guy.animations.add('kick', [30], 10, true);
    player1.guy.animations.add('airKick', [35], 10, true);
    player1.guy.animations.add('superKick', [31, 32, 33, 34], 10, false);
    player1.guy.animations.add('hurt', [27, 28], 10, true);
    player1.guy.animations.add('die', [22, 23, 24, 25, 26], 10, true);

    player2.guy.animations.add('walk', [4, 5, 6, 7, 8, 9, 10,11], 10, true);
    player2.guy.animations.add('punch', [18], 10, true);
    player2.guy.animations.add('kick', [30], 10, true);
    player2.guy.animations.add('airKick', [35], 10, true);
    player2.guy.animations.add('superKick', [31, 32, 33, 34], 10, false);
    player2.guy.animations.add('hurt', [27, 28], 10, true);
    player2.guy.animations.add('die', [22, 23, 24, 25, 26], 10, true);



    player1.hud = game.add.text(16, 16, player1.playerName + ': 0  Lives: ' + player1.lives, { fontSize: '10px', fill: '#000' });
    player2.hud = game.add.text(430, 16, player2.playerName +': 0 Lives: ' + player2.lives, { fontSize: '10px', fill: '#000' });



// set Player 2 Controls =

    player2.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    player2.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    player2.keyJump = game.input.keyboard.addKey(Phaser.Keyboard.W);
    player2.keyPunch = game.input.keyboard.addKey(Phaser.Keyboard.F);
    player2.keyKick = game.input.keyboard.addKey(Phaser.Keyboard.G);
    player2.keySuperKick = game.input.keyboard.addKey(Phaser.Keyboard.R);

}

function update() {

    for(var i = 0; i < allPlayers.length; i++){
        var currentPlayer = allPlayers[i];

        resetVelocity(currentPlayer);

        checkFace(currentPlayer);


        //  Collide the currentPlayer and the stars with the platforms
        game.physics.arcade.collide(currentPlayer.guy, platforms);


        if (!currentPlayer.guy.body.touching.down){
            currentPlayer.guy.frame = currentPlayer.lastFrame;

        };


        // Player movement:
        if (currentPlayer.keyLeft.isDown){
            currentPlayer.moveLeft();
        }

        else if (currentPlayer.keyRight.isDown){
            currentPlayer.moveRight();
        }

        else if (currentPlayer.keySuperKick.isDown){
            currentPlayer.superKick();
        }
        else{
            currentPlayer.guy.animations.stop();
            currentPlayer.guy.frame = currentPlayer.lastFrame;
        };

        if (currentPlayer.keyJump.isDown){
            currentPlayer.jump();
        };

        if (currentPlayer.keyPunch.isDown){
            currentPlayer.punch();
        }

        else if (currentPlayer.keyKick.isDown){
            currentPlayer.kick();
        };


        if (currentPlayer.guy.body.touching.down){
            currentPlayer.jumpOne = false;
            currentPlayer.jumpTwo = false;
            currentPlayer.lastFrame = 0;
        };

        playerDead(currentPlayer);
    };


};


function resetVelocity(pice1){
        if(pice1.hurt == false)
        pice1.guy.body.velocity.x = 0
};

function touching(pice1, pice2){
    if (pice1.guy.body.x  <= (pice2.guy.body.x + 64) &&  pice2.guy.body.x <= (pice1.guy.body.x + 64)
            && pice1.guy.body.y  <= (pice2.guy.body.y + 64) &&  pice2.guy.body.y <= (pice1.guy.body.y + 64) ) {
        return true;
    };
};

function playerHurt(hurtPlayer, otherPlayer){

        hurtPlayer.guy.allowGravity = false;

        if (otherPlayer.isLeft){
            hurtPlayer.guy.body.velocity.setTo (-(hurtPlayer.percent * otherPlayer.attackPercent), -(hurtPlayer.percent * otherPlayer.attackPercent));
        }
        else {
            hurtPlayer.guy.body.velocity.setTo ((hurtPlayer.percent * otherPlayer.attackPercent), -(hurtPlayer.percent * otherPlayer.attackPercent));
        }

        hurtPlayer.lastFrame = 28;

        hurtPlayer.hud.text = hurtPlayer.playerName + ": " + Math.floor((hurtPlayer.percent * 2) / 10) + "  Lives: "  + hurtPlayer.lives;
        hurtPlayer.guy.animations.play('hurt');

        resetPlayerMovement(hurtPlayer);

};


function resetPlayerMovement(hurtPlayer){
        setTimeout(function() {
            hurtPlayer.percent += 1
            hurtPlayer.guy.body.velocity.x = 0;
            hurtPlayer.guy.body.velocity.y = 0;
            hurtPlayer.guy.allowGravity = true;
            hurtPlayer.hurt = false;

        }, (hurtPlayer.percent * 2) );
};


function checkFace(pice1){
    if (pice1.isLeft){
        pice1.guy.scale.x = -1;
    }
    else {
       pice1.guy.scale.x = 1;
    };

};


function playerDead(pice){
    if (pice.lives != 0){
        var posX = pice.guy.body.x;
        var posY = pice.guy.body.y;
        if(posX < killZone.left|| posX > killZone.right || posY > killZone.top || posY < killZone.bottom){
            pice.guy.kill();

            pice.guy.revive();
            pice.guy.body.x = 250;
            pice.guy.body.y = game.world.height -400;
            pice.percent = 0;
            pice.lives -= 1;
            pice.lastFrame = 0;
            pice.hud.text = pice.playerName + ": " + 0 + "  Lives: "  + pice.lives;

        };
    }
    else {
        restartGame();
    }

};

function restartGame() {
    player1.lives = lifesPerPerson;
    player1.lastFrame = 0;
    player2.lives = lifesPerPerson;
    player2.lastFrame = 0;
    game.state.start(game.state.current);


}
