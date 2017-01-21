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
	this.force = undefined;
	this.velocity = undefined;
	this.position = {x:undefined, y:undefined};
}

Player.prototype.Update = function (game_status, istouched) {
	var pnow = this.position;
	//var F = ()?():();
	var V = F * ( 1000 / 30 ); 
	var pnext = {x: pnow.x, y: pnow.y + (V * (1000 / 30))};
	this.position = pnext; /* Iteration */
}

var Render = function () {
	this.canv = document.getElementById ("mega");	
	this.cx = this.canv.getContext('2d');
}

Render.prototype.dot = function (r, x, y, color) {
}

Render.prototype.text = function (text) {
	this.cx.fillStyle = "green";
	this.cx.fillText (text.toString(), 10, 10);	
}

Render.prototype.clear = function () {
	this.cx.fillStyle = "rgb(255,0,0)";
	console.log(this.canv.width.toString());
	this.cx.fillRect(0, 0, 500, 700);
}

Render.prototype.Exec = function (player_status) {
	this.clear();
	this.text(player_status);
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

	/* Use Render() to Draw in canvas */
	document.title = this.eventer.Touched();
	this.render.Exec (this.eventer.Touched());
}

new Game(
	new Eventer(),
	new Render(),
	new Player()
);


