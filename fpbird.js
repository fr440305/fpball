/**
 * fpbird.js
 * Author - Huoyu
 */


var Player = function () {
	this.player_stat = undefined;
	this.score = 0;
	this.accel = 0;
	this.velocity = 0;
	this.position = {x:42, y:230};
}

Player.prototype.ValueOf = function (of_what) {
	return {
		"position": this.position,
		"velocity": this.velocity,
		"status": this.player_stat,
		"score": this.score
	}[of_what];
}

Player.prototype.Update = function (game_status, istouched, stars) {
	/*move player */
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
	/*collision detection between player and stars */
	var dx, dy;
	for (var i = 0; i < stars.length; i++) {
		dx = stars[i].x - this.position.x;
		dy = stars[i].y - this.position.y;
		if ( dx * dx + dy * dy <= 900 ) {
			this.velocity /= 2;
			this.score ++;
			return i;
		}
	}
}

var Stars = function () {
	this.stars_stat = 0;
	this.stars_group = [];
}

Stars.prototype.newStar = function () {
	var newstar = { x: 500, y: Math.floor(Math.random()*500) };
	this.stars_group.push(newstar);
}

Stars.prototype.Update = function () {
	if (this.stars_stat % 50 === 0) {
		/* .. */
		this.newStar();
		this.stars_stat = 0;
	}
	this.stars_stat ++;
	this.moveStar();
	for (var i = 0; this.stars_group[i].x <= 0; i++) {
		this.DelStar(i);
	}
}

Stars.prototype.DelStar = function (index) {
	this.stars_group.splice (index, 1);
}

Stars.prototype.moveStar = function () {
	for (var i = 0; i < this.stars_group.length; i++) {
		this.stars_group[i].x -= 4;
	}
}

Stars.prototype.GetStars = function () {
	return this.stars_group;
}

var Render = function () {
	this.canv = document.getElementById ("mega");	
	this.cx = this.canv.getContext('2d');
}

Render.prototype.star = function (color, x, y, r) {
	this.cx.fillStyle = color;
	this.cx.strokeStyle = color;
	this.cx.beginPath();
	var prev_x = undefined;
	var prev_y = undefined;
	for (var zeta_ = 0; zeta_ < 360; zeta_ ++) {
		var zeta = zeta_ / 180 * Math.PI;
		r_t = (Math.sin(zeta * 5)/4 + 1) * r
		x_t = x + r_t * Math.cos(zeta)
		y_t = y + r_t * Math.sin(zeta)
		if (prev_x === undefined) {
			this.cx.moveTo(x_t, y_t);
		} else {
			this.cx.lineTo(x_t, y_t);
			this.cx.stroke();
		}
		prev_x = x_t;
		prev_y = y_t;

	}
	this.cx.fill();
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
	this.cx.fillStyle = "rgb(0,23,64)";
	this.cx.fillRect(0, 0, 500, 700);
}

Render.prototype.Exec = function (player_position, player_score, stars_group) {
	/* TODO - refactor this function. shrink the arguments to a big 'render object' */
	this.clear();
	this.text (player_score.toString());
	this.dot ("#3366ff", player_position.x, player_position.y, 10);
	for (var i = 0; i < stars_group.length; i++) {
		this.dot("#ccff33", stars_group[i].x, stars_group[i].y, 20);
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

var Walls = function () {
}

var Game = function (eventer_obj, render_obj, player_obj, stars_obj, walls_obj) {
	if (document.getElementById('mega') === undefined) {
		throw "can not find Mega!";
		return 0;
	} else {
		document.body.style.backgroundColor = "black";
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
	this.stars = stars_obj;
	this.walls = walls_obj;
	this.timerid = setInterval(function(){Me.loop()}, /*frame_rate->*/30);
	this.eventer.Bind();
};

Game.prototype.loop = function () {
	/* Fetch the current status of the whole game */
	var eaten_star = this.player.Update(undefined, this.eventer.Touched(), this.stars.GetStars());
	/* Analyze and Update the Game's Status */
	if (eaten_star !== undefined) {
		this.stars.DelStar(eaten_star);
	}
	this.stars.Update();
	/* Use Render() to Draw in canvas */
	this.render.Exec (this.player.ValueOf("position"), this.player.ValueOf('score'), this.stars.GetStars());
}

new Game(
	new Eventer(),
	new Render(),
	new Player(),
	new Stars(),
	new Walls()
);
