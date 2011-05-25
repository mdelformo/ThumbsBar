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
