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

///// Event handling functions

function addListeners() {
	
	document.getElementById('container').addEventListener('mousedown', boxGrab, false);
	// TODO
	document.addEventListener('keydown', scrollThumbs, false);
	document.addEventListener('keyup', keyUp, false);

}

function scrollThumbs(e) {}
function keyUp(e) {}


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
