var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;
var heart1,heart2,heart3;
var heart1Img,heart2Img,heart3Img;
var zombieGroup;
var bullets=70;
var score=0;
var life=3;
var lose,winning,explosionSound;
var gameState="fight";



function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")

  zombieImg = loadImage("assets/zombie.png")

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  lose=loadSound("assets/lose.mp3")
  winning=loadSound("assets/win.mp3")
  explosionSound= loadSound("assets/explosion.mp3")
}

function setup() {

  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.1
  
  //creating the player sprite
  player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  player.debug = false;
  player.setCollider("rectangle",0,0,300,300)

  heart1=createSprite(displayWidth-150,40,20,20);
  heart1.visible = false;
  heart1.addImage("heart1",heart1Img);
  heart1.scale=0.4;
  heart1.debug = true;
  

  heart2=createSprite(displayWidth-100,40,20,20);
  heart2.visible = false;
  heart2.addImage("heart2",heart2Img);
  heart2.scale = 0.4;
  

  heart3=createSprite(displayWidth-50,40,20,20);
  heart3.visible = false;
  heart3.addImage("heart3",heart3Img);
  heart3.scale=0.4;

  zombieGroup=new Group()
  bulletGroup=new Group();

}

function draw() {
  background(0); 

  if(gameState==="fight")
  {
    if(life===3)
    {
      heart3.visible=true;
      heart2.visible=true;
      heart1.visible=true;  
    }
    if(life===2)
    {
      //heart3.visible=false;
      heart2.visible=true;
      heart1.visible=true;
    }
    if(life===1)
    {
      heart3.visible=false;
      heart2.visible=false;
      //heart1.visible=true;
    }
    if(life===0)
    {
      heart1.visible = false;
      heart2.visible = false;
      heart3.visible = false;

      gameState="lost";
    }
    if(score==100)
    {
      gameState="won";
      winning.play();
    }

    //moving the player up and down and making the game mobile compatible using touches
    if(keyDown("UP_ARROW")||touches.length>0)
    {
      player.y = player.y-30
    }
    if(keyDown("DOWN_ARROW")||touches.length>0)
    {
      player.y = player.y+30
    }
  }

  //release bullets and change the image of shooter to shooting position when space is pressed
  if(keyWentDown("space"))
  {
    bullet=createSprite(displayWidth-1150,player.y-30,20,10);
    bullet.velocityX=20
    bulletGroup.add(bullet)
    player.depth=bullet.depth
    player.depth= player.depth+2
    player.addImage(shooter_shooting)
    bullets=bullets-1;
    explosionSound.play()
  }

  //player goes back to original standing image once we stop pressing the space bar
  else if(keyWentUp("space"))
  {
    player.addImage(shooterImg)
  }

  if(bullets==0)
  {
    gameState="bullet";
    lose.play()
  }

  //destroy the zombie when the bullet touches it
  if(zombieGroup.isTouching(bulletGroup))
  {
    for(var i=0;i<zombieGroup.length;i++)
    {
      if(zombieGroup[i].isTouching(bulletGroup))
      {
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play()
        score=score+2;
      }
    }
  }

  //distroy zombie when player touches it 
  if(zombieGroup.isTouching(player))
  {
    lose.play()
    for(var i=0;i<zombieGroup.length;i++)
    {
      if(zombieGroup[i].isTouching(player))
      {
        zombieGroup[i].destroy()
        life=life-1;
      }
    }
  }

  spawnZombie()
  drawSprites();
//displaing the score and remaining lives and BULLETS
  textSize(20);
  fill("white");
  text("Bullets= "+bullets,displayWidth-210,displayHeight/2-250);
  text("Score= "+score,displayWidth-200,displayHeight/2-220);
  text("Lives= "+life,displayWidth-200,displayHeight/2-280);

  //destroy zombie and player and display a message in game state"lost"
  if(gameState=="lost")
  {
    textSize(100)
    fill("red")
    text("YOU LOST",400,400)
    zombieGroup.destroyEach()
    player.destroy()
  }

  //destroy zombie and player and display message in the gameState won
  else if(gameState=="won")
  {
    textSize(100)
    fill("yellow")
    text("WON",400,400)
    zombieGroup.destroyEach()
    player.destroy()
  }

  //destroy zombie,player and bullets and display a messgage in gameState bullet
  else if(gameState=="bullet")
  {
    textSize(50)
    fill("yellow")
    text("YOU RAN OUT OF BULLETS!!!",470,410)
    zombieGroup.destroyEach()
    player.destroy()
    bulletGroup.destroyEach()
  }
}

function spawnZombie()
{
  if (frameCount % 60 === 0)
  {
    var zombie = createSprite(random(500,1100),random(100,500),40,40);
    zombie.velocityX = -3;
    zombie.addImage(zombieImg);
    zombie.scale=0.15;
    zombie.debug=false;
    zombie.setCollider("rectangle",0,0,400,400);
    zombie.lifetime=400;
    zombieGroup.add(zombie)

  }
}