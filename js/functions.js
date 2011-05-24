var request;

function createThumbsBar() {
	
	initRequest();
	sendRequest("create");
	
}


function showThumbsBar() {

	initRequest();
	sendRequest("show");

}

function initRequest() {

	if (window.XMLHttpRequest) {

		request = new XMLHttpRequest();

	}

}

function sendRequest(value) {

	request.open('GET', 'thumbsbar.php?q=' + value, true);
    request.onreadystatechange = handleRequest;
    request.send(null);

}

function handleRequest() {

	if (request.readyState==4 && request.status==200) {
	
		document.getElementById("progressbar").innerHTML = request.responseText;
	
	}
	
	else document.getElementById("progressbar").innerHTML = "Creating thumbnails..";
	
}
