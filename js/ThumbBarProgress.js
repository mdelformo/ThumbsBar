// This class handles ajax requests to the server to see the progress of creating thumbbar of images.
// The result of the progress is shown in a separated div (set in "setOutputDiv").
function ThumbBarProgress () {
    var _outputDiv;
    var _ajaxRequest;
    var _interval;

    if (!window.XMLHttpRequest) {
        throw new Error("XMLHttpRequest not supported");
    }
    
    // End of constructor!
    
    // Returns true if the server is busy creating thumbnails.
    this.isProcessing = function() {
        return (_ajaxRequest != null);
    }

    // Set the div that displays output from the progress.
    this.setOutputDiv = function(outputDiv) {
        _outputDiv = outputDiv;
    }


    // Private. Called from ajax.
    // Called during the ajax call life cycle. If the ajax call i successful it will call handleResponse().
    // Returns nothing, but set the text in the output div.
    // If the creation is finished, the ajax request is ended.
    this.ajaxReturn = function () {
        if (_ajaxRequest && _ajaxRequest.readyState==4) {
            var ajaxCallSuccessful = _ajaxRequest.status==200;
            if (ajaxCallSuccessful) {
                var response = _ajaxRequest.responseText;
                // Might end the ajax request. 
                _outputDiv.innerHTML = thumbBarProgress.handleResponse(response);
            } else {
                _outputDiv.innerHTML= 'Ajax error';
                thumbBarProgress.endProgressInterval();
            }
        }
    }
    
    // Private. Called from ajax.
    // Handles the successful response from the server. 
    // Returns the result of the progress as a string.
    // If the creation is finished the function ends the ajax interval
    this.handleResponse = function(response) {
        var responseArray = response.split('|');
        if (responseArray.length==2) {
            var currentFile = parseInt(responseArray[0]);
            var totalFiles = parseInt(responseArray[1]);
            if (currentFile<totalFiles) {
                return currentFile + " (of " + totalFiles + " files)";            
            } else {
                thumbBarProgress.endProgressInterval();
                return "Done!";
            }
        } else {
            thumbBarProgress.endProgressInterval();
            return 'The response from the server was invalid';
        }
    }

    // Ends the ajax call interval.
    this.endProgressInterval = function() {
        if (_interval){
            clearInterval(_interval);
            this.endAjaxRequest();
        }
    }
    
    // Starts the ajax call interval if no ajax call is being active.
    this.startProgressInterval = function() {
        if (!_ajaxRequest) {
            _interval = setInterval("thumbBarProgress.startAjaxRequest();",100);
        }
    }

    // Private function
    // Starts ONE ajax call. Ends any ajax request.
    this.startAjaxRequest = function() {
        this.endAjaxRequest();
        _ajaxRequest = new XMLHttpRequest();
        _ajaxRequest.open('GET', 'thumbsbar.php?q=progress', true);
        _ajaxRequest.onreadystatechange = this.ajaxReturn; 
        _ajaxRequest.send(null);	
    }

    // Private function
    // Ends the ajax request (if existing)
    this.endAjaxRequest = function() {
        if (_ajaxRequest) {
            _ajaxRequest.abort();
            _ajaxRequest=null;
        }
    }
}

// The ThumbsBarProgress instance
var thumbBarProgress;

// Starts creating thumbnails (if not waiting for a creation to be complete).
// Returns: True if successfully started to create. 
function startCreatingThumbnails() {
    if (!thumbBarProgress.isProcessing()) {
        var createRequestSent = createThumbsBar();
        if (createRequestSent) 
        {
            thumbBarProgress.startProgressInterval();
            return true;
        }        
    }
    return false;
}

// Creates an instance of ThumbsBarProgress and sets the output div.
window.onload = function() {
    thumbBarProgress = new ThumbBarProgress();  
    thumbBarProgress.setOutputDiv(document.getElementById('progressbar_output'));
};