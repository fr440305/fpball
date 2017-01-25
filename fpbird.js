/*fpbird.js
 * Author - FireRain - Also the potential author of 'The Jounery of Floatess'
 */


var Player = function () {
	this.player_stat = undefined;
	this.accel = 0;
	this.velocity = 0;
	this.position = {x:42, y:230};
}

Player.prototype.ValueOf = function (of_what) {
	return { "position": this.position, "velocity": this.velocity, "status": this.player_stat }[of_what];
}

Player.prototype.Update = function (game_status, istouched, walls) {
	/* i don't know what game_status means */
	var delta_t = 30 / 1000;
	var a_f = (istouched === true) ? (-800) : (0);
	this.accel = 400 + a_f; /* 400 is for gravity acceleration */
	if (this.position.y <= 0) {
		this.position.y = 0;
		this.velocity = -this.velocity;
	}
	if (this.position.y >= 700) {
		this.position.y = 700;
		this.velocity = -this.velocity;
	}
	this.velocity = this.velocity + this.accel * delta_t; /* V = at */
	var pnow = this.position;
	var pnext = {x: pnow.x, y: pnow.y + (this.velocity * delta_t)};
	this.position = pnext; /* Iteration */
}

var Walls = function () {
	this.wall_stat = 0;
	this.walls_group = [];
}

Walls.prototype.newWall = function () {
	var newall = { x: 500, y: 0, b: Math.floor(Math.random()*500) };
	this.walls_group.push(newall);
}

Walls.prototype.Update = function () {
	if (this.wall_stat % 50 === 0) {
		/* .. */
		this.newWall();
		this.wall_stat = 0;
	}
	this.wall_stat ++;
	this.moveWall();
}

Walls.prototype.moveWall = function () {
	for (var i = 0; i < this.walls_group.length; i++) {
		this.walls_group[i].x -= 4;
	}
}

Walls.prototype.GetWalls = function () {
	return this.walls_group;
}

var Render = function () {
	this.canv = document.getElementById ("mega");	
	this.cx = this.canv.getContext('2d');
}

Render.prototype.dot = function (color, x, y, r) {
	this.cx.fillStyle = color;
	this.cx.beginPath();
	this.cx.arc(x, y, r, 0, 6.28, false);
	this.cx.fill();
}

Render.prototype.text = function (text) {
	this.cx.fillStyle = "#66ccff";
	this.cx.fillText (text.toString(), 10, 10);	
}

Render.prototype.clear = function () {
	this.cx.fillStyle = "rgb(0,64,230)";
	this.cx.fillRect(0, 0, 500, 700);
}

Render.prototype.Exec = function (player_position, player_status, walls_group) {
	/* TODO - refactor this function. shrink the arguments to a big 'render object' */
	this.clear();
	this.text (player_status +'//'+player_position.x.toString() +","+ player_position.y.toString());
	this.dot ("green", player_position.x, player_position.y, 10);
	
	for (var i = 0; i < walls_group.length; i++) {
		this.dot ("red", walls_group[i].x, walls_group[i].b, 20);
	}
}

var Eventer = function () {
	this.istouched = false;
}

Eventer.prototype.Bind = function () {
	/* Bind touch events */
	var Me = this;
	document.getElementById("mega").addEventListener("touchstart", function(e){
		e.preventDefault();
		Me.istouched = true;
	}, false);
	document.getElementById("mega").addEventListener("touchend", function(e){
		e.preventDefault();
		Me.istouched = false;
	}, false);
	/* Bind keyboard events */
	document.addEventListener("keydown", function(e){
		e.preventDefault();
		e = e || windows.event;
		e = e.keyCode || e.which;
		if (e === 32) {
			Me.istouched = true;
		}
	}, false);
	document.addEventListener("keyup", function(e){
		e.preventDefault();
		e = e || windows.event;
		e = e.keyCode || e.which;
		if (e === 32) {
			Me.istouched = false;
		}
	}, false);
}

Eventer.prototype.Touched = function () {
	return this.istouched;
}

var Game = function (eventer_obj, render_obj, player_obj, walls_obj) {
	if (document.getElementById('mega') === undefined) {
		throw "can not find Mega!";
		return 0;
	} else {
		var mega = document.getElementById('mega');
		mega.style.position = "absolute";
		mega.style.top = "0";
		mega.style.left = "0";
		mega.style.width = mega.width;
		mega.style.height = mega.height;
		mega.style.borderStyle = "dotted";
	}
	var Me = this;
	this.eventer = eventer_obj; 
	this.player = player_obj;
	this.render = render_obj;
	this.walls = walls_obj;
	this.timerid = setInterval(function(){Me.loop()}, /*frame_rate->*/30);
	this.eventer.Bind();
};


Game.prototype.loop = function () {
	/* Fetch the current status of the whole game */
	
	/* Analyze and Update the Game's Status */
	this.player.Update(undefined, this.eventer.Touched(), this.walls.GetWalls());
	this.walls.Update();

	/* Use Render() to Draw in canvas */
	this.render.Exec (this.player.ValueOf("position"), this.player.ValueOf('status'), this.walls.GetWalls());
}

new Game(
	new Eventer(),
	new Render(),
	new Player(),
	new Walls()
);
