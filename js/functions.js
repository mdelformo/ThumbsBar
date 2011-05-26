window.onload	= addListeners;

var request;
var movetimer; 

//For fading in elements. Causes annoying flickering.
var fadetimer;
var opacity = 0.1;

function createThumbsBar() {
	
	document.getElementById("progressbar").innerHTML = "Creating thumbnails..";
	
	if (window.XMLHttpRequest) request = new XMLHttpRequest();
	
	request.open('GET', 'thumbsbar.php?q=create', true);
 	
 	request.onreadystatechange=function(){
 	
 		if (request.readyState==4 && request.status==200) {
	
			document.getElementById("progressbar").innerHTML = request.responseText;
	
		}
 	
 	}
  	
  	request.send(null);
	
}


function showThumbsBar() {

	if (window.XMLHttpRequest) request = new XMLHttpRequest();
	
	request.open('GET', 'thumbsbar.php?q=show', true);
 	
 	request.onreadystatechange=function(){
 	
 		if (request.readyState==4 && request.status==200) {
	
			document.getElementById("imagebar").innerHTML = request.responseText;
			document.getElementById("leftarrow").style.visibility = "visible";
			document.getElementById("rightarrow").style.visibility = "visible";
			
			
			imgb		= document.getElementById("imagebar");
			fadetimer 	= setInterval("elementFadeIn(imgb)", 50);
	
		}
	
		else document.getElementById("imagebar").innerHTML = "Loading thumbnails..";
 	
 	
 	}
  	
  	request.send(null);

}	

// Event handling functions

function addListeners() {
	
	document.getElementById('container').addEventListener('mousedown', boxGrab, false);
	document.addEventListener('keydown', keyDown, false);
	document.addEventListener('keyup', keyUp, false);

}

function keyDown(e) {
	
	keyNum 	= (e.which);
	
	// Kill current animation, if active
	clearInterval(movetimer);

	// Left arrow key
	if (keyNum == 37) {
	
		// Prevent entire site from scrolling
		e.preventDefault();
		
		initMoveLeft();
	
	}

	// Right arrow key
	if (keyNum == 39) {
	
		// Prevent entire site from scrolling
		e.preventDefault();		
	
		initMoveRight();
	
	}

}

function keyUp(e) {

	//document.addEventListener('keydown', scrollThumbs, false);

}

function initMoveLeft() {

	// Does this work in all browsers?
	wwidth		= window.innerWidth;
	
	divStartX	= parseInt(document.getElementById("container").style.left, 10);
		
	movetimer	= setInterval("moveLeft(divStartX, wwidth)", 1);

}

function initMoveRight() {

	// Does this work in all browsers?
	wwidth		= window.innerWidth;

	divStartX	= parseInt(document.getElementById("container").style.left, 10);
	
	movetimer 	= setInterval("moveRight(divStartX, wwidth)", 1);

}


// Triggered by left arrow keyboard button. Moves the thumbsbar the entire width
// of the screen in an animation

function moveLeft(divStartX, windowWidth) {

	divCurrentX	= parseInt(document.getElementById("container").style.left, 10);

	if (divCurrentX > divStartX - windowWidth) {
		
		divX 		= divCurrentX -= 20;
		document.getElementById("container").style.left = divX + "px";

	}
	
	else clearInterval(movetimer);

}

// Triggered by right arrow keyboard button. Moves the thumbsbar the entire width
// of the screen in an animation

function moveRight(divStartX, windowWidth) {

	divCurrentX	= parseInt(document.getElementById("container").style.left, 10);

	if (divCurrentX < divStartX + windowWidth) {
		
		divX 		= divCurrentX += 20;
		document.getElementById("container").style.left = divX + "px";

	}
	
	else clearInterval(movetimer);

}

function boxGrab(e) {

	e.preventDefault();
	
	mouseStartX = e.clientX + window.scrollX;
	
	divStartX	= parseInt(this.style.left, 10);
	
	this.addEventListener('mousemove', boxMove, false);
	this.addEventListener('mouseup', boxRelease, false);
	//this.addEventListener('mouseout', boxRelease, false);	
	
}

function boxMove(e) {

	// METHOD TO DRAG THUMBSBAR // NOT FINNISHED YET

	e.preventDefault();
	
	mouseX 		= e.clientX + window.scrollX;
	
	divWidth	= parseInt(this.style.width, 10);
	divCurrentX	= parseInt(this.style.left, 10);
	
	divX 			= (divStartX + mouseX - mouseStartX);
	this.style.left = divX + "px";

}


function boxRelease() {
	
	this.removeEventListener('mousemove', boxMove, false);

}

function displayImage(image) {
	
	img 		= document.getElementById('mainimg');
	img.style.visibility	= "visible";
	//img.style.opacity		= "0.1"
	img.src 	= image;
	
	//fadetimer = setInterval("fadeImage(img)", 100);
	
}

// To be called from the setInterval function
// Causes flickering. Try to solve that..
function elementFadeIn(element) {

	if (opacity < 1.0) {
	
		opacity += 0.1;
		element.style.opacity = opacity;
	
	} else { 
		
		clearInterval(fadetimer);
		//opacity = 0.1;
	
	}
}
