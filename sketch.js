//Variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trexRunning, trexCollided;
var ground, invisibleGround, groundImg;

var cloudsGroup, cloudImg, sun, sunImg;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg;
var score = 0;

var gameOver, restart, gameOverImg, restartImg;

function preload(){
  //Loading the images
  backgroundImg = loadImage("images/backgroundImg.png");
  sunImg = loadImage("images/sun.png");
  trexRunning = loadImage("images/trex_2.png","images/trex_1.png","images/trex_3.png");
  trexCollided = loadImage("images/trex_collided.png");
  groundImg = loadImage("images/ground.png");
  cloudImg = loadImage("images/cloud.png");
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  
  //Making the sprites
  sun = createSprite(width-50,100,10,10);
  sun.addImage("sun", sunImg);
  sun.scale = 0.1;

  trex = createSprite(50,height-70,20,50);
  trex.addImage("running", trexRunning);
  trex.addImage("collided", trexCollided);
  trex.scale = 0.08;

  //Creating the Invisible ground
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.shapeColor = "#F4CBAA";

  //Ground
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground", groundImg);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  //gameOver sprite
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage("ImgOfGameOver", gameOverImg);
  gameOver.scale = 0.5;

  //restart sprite
  restart = createSprite(width/2, height/2);
  restart.addImage("ImgOfRestart", restartImg);
  restart.scale = 0.1;

  //Making gameOver and restart invisible
  gameOver.visible = false;
  restart.visible = false;

  //Creating the groups
  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(backgroundImg);  
  textSize(20);
  fill("black");
  text("Score: "+ score,30,50);

  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  }

  if(keyDown("SPACE") && trex.y >= height-120){
    trex.velocityY = -10;
    camera.position.x = displayWidth/3;
    //camera.position.y = trex.y;
 }
  
  trex.velocityY = trex.velocityY + 0.8;

  if(ground.x < 0){
    ground.x = ground.width/2;
  }

  trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();

  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
  }

  else if (gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided",trexCollided);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    } 
  }

  drawSprites();
}

function spawnClouds() {
  //Spawn clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}


function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
              
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trexRunning);
  
  score = 0;    
  
}