window.onload	= addListeners;

var request;		// Ajax request sent to thumbsbar.php
var movetimer;		// Timer used for animation of the thumbsbar container
var fadetimer;		// Timer used for fading in/out the thumbsbar
var divWidth; 		// Width of thumbsbar container
var opacity = 0.0;	// Initial opacity for the thumbsbar and mainimage
var lastreponse; 	// Keep track of the previous response
var firstImage;

// Sends a GET request to server asking for a Thumbsbar to be created

function createThumbsBar() {

	var folderName = document.getElementById('folder_select').value;
    
    if (folderName) {
	
		document.getElementById("progressbar").innerHTML = "Creating thumbnails..";
	
		if (window.XMLHttpRequest) request = new XMLHttpRequest();
	
			request.open('GET', 'thumbsbar.php?q=create&folder='+folderName, true);
		 	
		 	request.onreadystatechange=function() {
		 	
		 	if (request.readyState==4 && request.status==200) {
	
				document.getElementById("progressbar").innerHTML = request.responseText;
	
			}
	 	
	 	}
	  	
	  	request.send(null);
	  	return true;  // it is ok to check for progress
	} else { 
	
		document.getElementById("progressbar").innerHTML = 'A folder must be selected';
		return false;  // it is not ok to check for progress
	}
	
}

// Sends a GET request to server asking to show the thumbsbar

function showThumbsBar() {

    var folderName = document.getElementById('folder_select').value;
    
    if (folderName) {

		if (window.XMLHttpRequest) request = new XMLHttpRequest();
	
		request.open('GET', 'thumbsbar.php?q=show&folder='+folderName, true);
	 	
 		request.onreadystatechange=function(){
 	
	 		if (request.readyState==4 && request.status==200) {
	 		
	 			// Since I can't seem to set the width value of 'container' from
	 			// php, parse the value from the request
	 		
	 			responseSplit 	= request.responseText.split("||");
				divWidth 		= parseInt(responseSplit[0], 10);
				firstImage		= responseSplit[1];
				response 		= responseSplit[2];
				imgb			= document.getElementById('imagebar');
			
				// Fade in if arrow isn't visible (i.e. first time), else fade out/in
				// Fade out automatically calls fade in when finnished
			
				if (document.getElementById('leftarrow').style.visibility == 'hidden') {

					document.getElementById("imagebar").innerHTML = response;
					fadetimer			= setInterval(function() { elementFadeIn(imgb, firstImage) }, 50);
				
					document.getElementById("leftarrow").style.visibility = "visible";
					document.getElementById("rightarrow").style.visibility = "visible";
				
			
				} else { 
			
					// elementFadeOut updates the imagebar with new response when faded out
					document.getElementById("imagebar").innerHTML = lastresponse;
					opacity 	= 1.0;
					fadetimer 	= setInterval(function() { elementFadeOut(imgb, firstImage, response) }, 50);

				}
			
				// Save last response for using in imagebar while fading out
				lastresponse	= response;

			} else { 
		
				document.getElementById("imagebar").innerHTML 	= lastresponse;
 			}
 	
 		}
	  	
	  	request.send(null);

	} else { 
	
		document.getElementById("progressbar").innerHTML = 'A folder must be selected';
		
	}
	
}	

// Event handling functions

function addListeners() {
	
	document.getElementById('container').addEventListener('mousedown', boxGrab, false);
	document.addEventListener('keydown', keyDown, false);

}

function keyDown(e) {
	
	keyNum 	= (e.which);
	
	clearInterval(movetimer);	// Kill current animation, if active

	if (keyNum == 39) {			// Right arrow key - moves thumbsbar to the LEFT
	
		e.preventDefault();		// Prevent entire page from scrolling
		
		initMoveLeft();
	
	}

	if (keyNum == 37) {			// Left arrow key - moves thumbsbar to the RIGHT
	
		e.preventDefault();		// Prevent entire page from scrolling
	
		initMoveRight();
	
	}

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
	
	img 					= document.getElementById('mainimg');
	img.style.visibility	= "visible";
	img.src 				= image;
	
}

// Fades in the thumbsbar and sets a new main image
function elementFadeIn(element, img) {

	if (opacity < 1.0) {

		opacity += 0.1;
		element.style.opacity = opacity;

	} else { 

		clearInterval(fadetimer);
		opacity 	= 0.0;
		displayImage(img);
		
	}
	
}

function elementFadeOut(element, img, response) {

	if (opacity > 0.0) {
	
		opacity -= 0.1;
		element.style.opacity = opacity;

	} else { 
	
		clearInterval(fadetimer);
		document.getElementById("imagebar").innerHTML = response;
		document.getElementById("container").style.left = "0px";
		imgb		= document.getElementById('imagebar');
		fadetimer 	= setInterval(function() { elementFadeIn(imgb, firstImage) }, 50);

	}
	
}
