window.onload	= addListeners;

var request;		// Ajax request sent to thumbsbar.php
var movetimer;		// Timer used for animation of the thumbsbar container
var fadetimer;		// Timer used for fading in the thumbsbar
var divWidth; 		// Width of thumbsbar container
var opacity = 0.1;	// Initial opacity for the thumbsbar

// Sends a GET request to server asking for a Thumbsbar to be created

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

// Sends a GET request to server asking to show the thumbsbar

function showThumbsBar() {

	if (window.XMLHttpRequest) request = new XMLHttpRequest();
	
	request.open('GET', 'thumbsbar.php?q=show', true);
 	
 	request.onreadystatechange=function(){
 	
 		if (request.readyState==4 && request.status==200) {
 		
 			// Since I can't seem to set the width value of 'container' from
 			// php, parse the value from the request
 		
 			responseSplit = request.responseText.split("||");
			
			divWidth = parseInt(responseSplit[0], 10);
			response = responseSplit[1];
	
			document.getElementById("imagebar").innerHTML = response;
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
	
	clearInterval(movetimer);	// Kill current animation, if active

	if (keyNum == 37) {			// Left arrow key
	
		e.preventDefault();		// Prevent entire page from scrolling
		
		initMoveLeft();
	
	}

	if (keyNum == 39) {			// Right arrow key
	
		e.preventDefault();		// Prevent entire page from scrolling
	
		initMoveRight();
	
	}

}

function keyUp(e) {

	//document.addEventListener('keydown', scrollThumbs, false);

}

function initMoveLeft() {

	wwidth		= window.innerWidth;	// Does this work in all browsers?
	
	divStartX	= parseInt(document.getElementById("container").style.left, 10);
		
	movetimer	= setInterval("moveLeft(divStartX, wwidth)", 10);

}

function initMoveRight() {

	wwidth		= window.innerWidth;	// Does this work in all browsers?

	divStartX	= parseInt(document.getElementById("container").style.left, 10);
	
	movetimer 	= setInterval("moveRight(divStartX, wwidth)", 10);

}


// Triggered by left arrow keyboard button. Moves the thumbsbar the entire width
// of the screen in an animation

function moveLeft(divStartX, windowWidth) {

	divX		= parseInt(document.getElementById("container").style.left, 10);
	
	divRightX	= divWidth + divX;
	
	delta		= divRightX - windowWidth;

	if ((divX > divStartX - windowWidth)  && (divRightX > windowWidth)) {
		
		if(delta > 10) {
			
			divX = divX -= 10;
			document.getElementById("container").style.left = divX + "px";
		
		}
		
		else {
		
			divX = divX -= delta;
			document.getElementById("container").style.left = divX + "px";
	
		}
		
	}
	
	else clearInterval(movetimer);

}

// Triggered by right arrow keyboard button. Moves the thumbsbar the entire width
// of the screen in an animation

function moveRight(divStartX, windowWidth) {

	divX	= parseInt(document.getElementById("container").style.left, 10);

	delta	= -divX;

	if ((divX < divStartX + windowWidth) && (divX < 0)) {
		
		if (delta > 10) {
			
			divX = divX += 10;
			document.getElementById("container").style.left = divX + "px";

		}
		
		else {
		
			divX = divX += delta;
			document.getElementById("container").style.left = divX + "px";
		
		}
			
	}
	
	else clearInterval(movetimer);

}

function boxGrab(e) {

	e.preventDefault();
	
	mouseStartX = e.clientX + window.scrollX;
	
	divStartX	= parseInt(this.style.left, 10);
	
	this.addEventListener('mousemove', boxMove, false);
	this.addEventListener('mouseup', boxRelease, false);
	this.addEventListener('mouseout', boxRelease, false);	
	
}

function boxMove(e) {

	// Drags the thumbsbar by mouse movement

	e.preventDefault();
	
	wwidth		= window.innerWidth;	// Does this work in all browsers?
	
	mouseX 		= e.clientX + window.scrollX;

	divCurrentX	= parseInt(this.style.left, 10);
	
	divX 			= (divStartX + mouseX - mouseStartX);
	
	divRightX		= divX + divWidth;
	
	if (divWidth < wwidth) {
	
		if (divX >= 0 && divRightX <= wwidth) {
		
			this.style.left = divX + "px";		
		
		}
	
	}
	
	else if (divX < 1 && divRightX >= wwidth) {
		
		this.style.left = divX + "px";
	
	}

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

// Fades in the thumbsbar on init 
function elementFadeIn(element) {

	if (opacity < 1.0) {
	
		opacity += 0.1;
		element.style.opacity = opacity;
	
	} else { 
		
		clearInterval(fadetimer);
		//opacity = 0.1;
	
	}
}
