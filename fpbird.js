/* initialize */

/*REFACTOR - TODO - fill the following codes into Game()->constructor() */
document.getElementById("mega").style.position = "absolute";
document.getElementById("mega").style.top = "0";
document.getElementById("mega").style.left = "0";
document.getElementById("mega").style.width = "500px";
document.getElementById("mega").style.height = "700px";
document.getElementById("mega").style.borderStyle = "dotted";

/*objects */

var Player = function () {
	this.accel = 0;
	this.velocity = 0;
	this.position = {x:230, y:230};
}

Player.prototype.ValueOf = function (of_what) {
	/* TODO - refactor by using table-driven method */
	if (of_what === "position") {
		return (this.position);
	} else if (of_what === "velocity") {
		return this.velocity;
	}
}


Player.prototype.Update = function (game_status, istouched) {
	/* i don't know what game_status means */
	var delta_t = 30 / 1000;
	var a_f = (istouched === true) ? (-200) : (0);
	this.accel = 100 + a_f; /* 50 is for gravity acceleration */
	if (this.position.y >= 700 || this.position.y <= 0) {
		this.velocity = -this.velocity;
	}
	this.velocity = this.velocity + this.accel * delta_t; /* V = at */
	var pnow = this.position;
	var pnext = {x: pnow.x, y: pnow.y + (this.velocity * delta_t)};
	this.position = pnext; /* Iteration */
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

Render.prototype.Exec = function (player_position) {
	this.clear();
	this.text (player_position.x.toString() +"|"+ player_position.y.toString());
	this.dot ("green", player_position.x, player_position.y, 10);
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

var Game = function (eventer_obj, render_obj, player_obj) {
	var Me = this;
	this.eventer = eventer_obj; 
	this.player = player_obj;
	this.render = render_obj;
	this.timerid = setInterval(function(){Me.loop()}, /*frame_rate->*/30);
	this.eventer.Bind();
};


Game.prototype.loop = function () {
	/* Fetch the current status of the whole game */
	
	/* Analyze and Update the Game's Status */
	this.player.Update(undefined, this.eventer.Touched());

	/* Use Render() to Draw in canvas */
	this.render.Exec (this.player.ValueOf("position"));
}

new Game(
	new Eventer(),
	new Render(),
	new Player()
);
