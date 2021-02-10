
// Canvas include
cvs = document.getElementById("canvas")
ctx = cvs.getContext('2d');

let start_menu = document.querySelector('.start');
let game_menu = document.querySelector('.game');
let end_menu = document.querySelector('.end');
let nickname
// Variables

let dataEnemys = [];
let dataBullets = [];
let friction = 0.98
let counter = 0
let score = 0
let timer
let spawner
let timeToRespawn = 5000
let pingSpeed = 1

// Audio

let blaster1 = new Audio()
let blaster2 = new Audio()
blaster1.volume = 0.4
blaster2.volume = 0.4

// Images

let playerImg = new Image()
let pinguin1Img = new Image()
let pinguin2Img = new Image()
let bulletImg = new Image()

// UrLS

playerImg.src = 'img/player.png'
pinguin1Img.src = 'img/pen.png'
pinguin2Img.src = 'img/penguin.png'
bulletImg.src = 'img/bullet.png'

blaster1.src = 'img/blaster1.mp3'
blaster2.src = 'img/blaster2.mp3'
// Create classes

class Character{
	constructor(x, y, width, height, img){
		this.x = x,
		this.y = y,
		this.width = width,
		this.height = height,
		this.img = img
	}
}

class Pinguin extends Character{
	constructor(x, y, width, height, img, moveLeft){
		super(x, y, width, height, img)
		this.moveLeft = moveLeft,
		this.speed = pingSpeed,
		this.stamina = 10,
		this.collisionLeft,
		this.collisionRight
	}
	move(){
		if (this.collisionLeft) {
			this.moveLeft = true
		}else if(this.collisionRight){
			this.moveLeft = false
		}
		if (this.moveLeft) {
			this.x += this.speed;
		}else{
			this.x -= this.speed;
		}
	}
	checkCollisionRightP(){
		if (cvs.width > this.x +this.width) {
		   	this.collisionRight = false
		   	return
		}
		this.collisionRight = true
	}
	checkCollisionLeftP(){
		if (0 < this.x) {
		   	this.collisionLeft = false
		   	return
		}
		this.collisionLeft = true
	}
}

class Bullet extends Character{
	constructor(x, y, width, height, img){
		super(x, y, width, height, img)
		this.speed = 8
	}
	move(){
		this.y -= this.speed;
		for(let i in dataEnemys){
			for(let a in dataBullets){
				if (dataBullets[a].x < dataEnemys[i].x + dataEnemys[i].width &&
					dataBullets[a].x + dataBullets[a].width > dataEnemys[i].x &&
					dataBullets[a].y < dataEnemys[i].y + dataEnemys[i].height &&
					dataBullets[a].y + dataBullets[a].height > dataEnemys[i].y) {
					dataBullets.splice(a,1)
					dataEnemys.splice(i,1)
					score += 1
					change = false
				}
				
			}
		}
		
	}

}

class Player extends Character{
	constructor(x, y, width, height, img){
		super(x, y, width, height, img);
		this.velX = 0,
		this.max_speed = 3,
		this.speed = 1,
		this.stamina = 20,
		this.collisionLeft = false,
		this.collisionRight = false
	}
	move(moveLeft){
		if(moveLeft == true && this.collisionLeft == false){
			if(Math.abs(this.velX) < this.max_speed)
				this.velX -= this.speed;
			this.img.style.transform = "scaleX(-1)";
		}else if(moveLeft == false && this.collisionRight == false){
			if(this.velX < this.max_speed)
				this.velX += this.speed;
			this.img.style.transform = "scaleX(-1)";
		}
	}
	checkCollisionLeft(){
		if (0 < this.x) {
		   	this.collisionLeft = false
		   	return
		}
		this.collisionLeft = true
	}
	checkCollisionRight(){
		if (cvs.width > this.x +this.width) {
		   	this.collisionRight = false
		   	return
		}

		this.collisionRight = true
	}
	shoot(obj){
		if(this.stamina >= 100){
			this.stamina = 0;
			blaster2.play()
			dataBullets.push(obj)
			blaster1.play()
		}
	}
}


// Get random
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// Random spawn pinguins
function spawn(){
	let img = getRandomInt(2)
	if (img == 0){
		push = (x, y, direction) => dataEnemys.push(new Pinguin(x, y, 80, 80, pinguin2Img, direction));
	} else if (img == 1){
		push = (x, y, direction) => dataEnemys.push(new Pinguin(x, y, 80, 80, pinguin1Img, direction));
	}
	switch(getRandomInt(8)){
		case 0:
			push(2, 0, true);
			break;
		case 1:
			push(2, 100, true);
			break;
		case 2:
			push(2, 200, true);
			break;
		case 3:
			push(2, 300, true);
			break;
		case 4:
			push(cvs.width-100, 0, false);
			break;
		case 5:
			push(cvs.width-100, 100, false);
			break;
		case 6:
			push(cvs.width-100, 200, false);
			break;
		case 7:
			push(cvs.width-100, 300, false);
			break;
		default:
	}
}

//  Buttons
function pushButton(e){
	switch(e.keyCode){
		case 65:
			player.move(true)
			break;
		case 68:
			player.move(false)
			break;
		case 32:
		default:
	}
}

function restart(){
	end_menu.style.display = "none";
	game_menu.style.display = "block";
	clearInterval(timer);
	clearInterval(spawner);
	console.log('1dfe')
	dataBullets = []
	dataEnemys = []
	spawner = setInterval(spawn, timeToRespawn);
	timer = setInterval(draw, 10);
	score = 0
}


// Object palyer

let player = new Player(cvs.width/2, cvs.height - 80, 75, 80, playerImg);



// Buttons
document.getElementById("restart").addEventListener("click", restart)
document.getElementById("restart2").addEventListener("click", restart)
document.getElementById("start_game").addEventListener("click", start)

// Key binding
addEventListener("keydown", pushButton);
addEventListener('click', () => player.shoot(new Bullet(player.x + player.width/2, player.y - 5, 10, 40, bulletImg)))


// Game over
function lose(character, timer){
	if (character.y > cvs.height-200) {
		clearInterval(timer);
		clearInterval(spawner);
		game_menu.style.display = "none";
		end_menu.style.display = "block";
		document.getElementById("score_output").value = score
		document.getElementById("nickname_output").value = nickname

	}
}

function start(){
	nickname = document.getElementById('nickname').value;
	if(nickname != ""){
		spawner = setInterval(spawn, timeToRespawn);
		timer = setInterval(draw, 10);
		start_menu.style.display = "none";
		game_menu.style.display = "block";
	}
}

function updateInterval(){
	clearInterval(spawner);
	spawner = setInterval(spawn, timeToRespawn);
}

let change = false
function draw(){
	// Clear canvas
	ctx.clearRect(0,0,cvs.width,cvs.height);

	// Draw grid
	fillStyle = "black"
	for (let i = 1; i <= 4; i++) {
		ctx.fillRect(0, 100*i, cvs.width, 1);
	}

	// Draw player
	ctx.drawImage(player.img, player.x, player.y, player.width, player.height)
	// Set score
	// console.log(score)
	let blockScore = document.getElementById('score')
	blockScore.value = score;

	// Check player collision
	player.checkCollisionLeft()
	player.checkCollisionRight()

	
	// Pinguins calculating 
	for (let ping of dataEnemys){
		ctx.drawImage(ping.img, ping.x, ping.y, ping.width, ping.height)
		ping.checkCollisionLeftP()
		ping.checkCollisionRightP()
		if (ping.collisionLeft && ping.stamina == 10){
	   		ping.y += 100;
	   		ping.stamina = 0;
		} else if (ping.collisionRight && ping.stamina == 10){
			ping.y += 100;
			ping.stamina = 0;
		}
		ping.move()
		if(ping.stamina < 10){
			ping.stamina += 1
		}
		lose(ping, timer)
	}
	

	// Player collision calculated
	if(!player.collisionLeft && !player.collisionRight){
		player.velX *= friction;
   		player.x += player.velX;
	} else if (player.collisionLeft){
   		player.x = 1;
	} else if (player.collisionRight){
		player.x = cvs.width-76;
	}
	// Itterator player stamina
	if(player.stamina <= 100) {
		player.stamina += 0.5
	}

	if (score%10 == 0 && score != 0 && !change) {
		pingSpeed *= 1.5
		timeToRespawn *= 0.98
		console.log(timeToRespawn)
		console.log(pingSpeed)
		updateInterval()
		change = true
	}
	document.getElementById('progress_bar').style.width = player.stamina + "%"

	// Draw bullets
	for (let i in dataBullets){
		ctx.drawImage(dataBullets[i].img, dataBullets[i].x, dataBullets[i].y, dataBullets[i].width, dataBullets[i].height)
		if (dataBullets[i].y < 0) {
			dataBullets.splice(i,1)
		}
	}

	//  Bullets calculating
	for (let i in dataBullets){
		dataBullets[i].move()
	}
}



