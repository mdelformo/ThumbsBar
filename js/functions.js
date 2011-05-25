window.onload	= addListeners;

var request;

function createThumbsBar() {
	
	if (window.XMLHttpRequest) request = new XMLHttpRequest();
	
	request.open('GET', 'thumbsbar.php?q=create', true);
 	
 	request.onreadystatechange=function(){
 	
 		if (request.readyState==4 && request.status==200) {
	
			document.getElementById("progressbar").innerHTML = request.responseText;
	
		}
	
		else document.getElementById("progressbar").innerHTML = "Creating thumbnails..";
 	
 	
 	}
  	
  	request.send(null);
	
}


function showThumbsBar() {

	if (window.XMLHttpRequest) request = new XMLHttpRequest();
	
	request.open('GET', 'thumbsbar.php?q=show', true);
 	
 	request.onreadystatechange=function(){
 	
 		if (request.readyState==4 && request.status==200) {
	
			document.getElementById("imagebar").innerHTML = request.responseText;
	
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
	
	keyNum = (e.which);

	// Left arrow key
	if (keyNum == 37) {
	
		// Prevent entire site from scrolling
		e.preventDefault();	
	
		//divWidth	= parseInt(this.style.width.replace(/-[\D]+/, ''), 10);
		divCurrentX	= parseInt(document.getElementById("container").style.left.replace(/-[\D]+/, ''), 10);
		divX 		= divCurrentX -= 10;
		document.getElementById("container").style.left = divX + "px";
	
	}

	// Right arrow key
	if (keyNum == 39) {
	
		// Prevent entire site from scrolling
		e.preventDefault();		
	
		//divWidth	= parseInt(this.style.width.replace(/-[\D]+/, ''), 10);
		divCurrentX	= parseInt(document.getElementById("container").style.left.replace(/-[\D]+/, ''), 10);
		divX 		= divCurrentX += 10;
		document.getElementById("container").style.left = divX + "px";
	
	}

}

function keyUp(e) {

	//alert('keyup');
	//document.addEventListener('keydown', scrollThumbs, false);

}

function boxGrab(e) {

	e.preventDefault();
	
	mouseStartX = e.clientX + window.scrollX;
	
	divStartX	= parseInt(this.style.left.replace(/-[\D]+/, ''), 10);
	
	this.addEventListener('mousemove', boxMove, false);
	this.addEventListener('mouseup', boxRelease, false);
	//this.addEventListener('mouseout', boxRelease, false);	
	
}

function boxMove(e) {

	// METHOD TO DRAG THUMBSBAR // NOT FINNISHED YET

	e.preventDefault();
	
	mouseX 		= e.clientX + window.scrollX;
	
	divWidth	= parseInt(this.style.width.replace(/-[\D]+/, ''), 10);
	divCurrentX	= parseInt(this.style.left.replace(/-[\D]+/, ''), 10);
	
	divX 			= (divStartX + mouseX - mouseStartX);
	this.style.left = divX + "px";

}


function boxRelease() {
	
	this.removeEventListener('mousemove', boxMove, false);

}

function displayImage(image) {
	
	img 		= document.getElementById('mainimg');
	//if (img.height < maxHeight)	img.height = maxHeight;
	img.style.visibility = "visible";
	img.src 	= image;
	
}
