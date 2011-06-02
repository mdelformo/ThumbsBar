function ThumbBarProgress (outputDiv) {
    var _outputDiv = outputDiv;
    var _ajaxRequest;
    var _interval;
    var _isFinishedProgressing = true;

    if (!window.XMLHttpRequest) {
        throw new Error("XMLHttpRequest not supported");
    }
    
    this.isProcessing = function() {
        return !_isFinishedProgressing;
    }


    this.ajaxReturn = function () {
        if (_ajaxRequest && _ajaxRequest.readyState==4) {
            var ajaxCallSuccessful = _ajaxRequest.status==200;
            if (ajaxCallSuccessful) {
                var response = _ajaxRequest.responseText;
                _outputDiv.innerHTML = thumbBarProgress.handleResponse(response);
            } else {
                _outputDiv.innerHTML= 'Ajax error';
                _isFinishedProgressing = true;
            }
            if (_isFinishedProgressing) {
                thumbBarProgress.endInterval();
            }
        }
    }
    
    this.handleResponse = function(response) {
        if (response != "FILE_ERROR") {
            var responseArray = _ajaxRequest.responseText.split('|');
            if (responseArray.length==2) {
                var currentFile = parseInt(responseArray[0]);
                var totalFiles = parseInt(responseArray[1]);
                if (currentFile<totalFiles) {
                    _isFinishedProgressing = false;
                    return currentFile + " (of " + totalFiles + " files)";            
                } else {
                    _isFinishedProgressing = true;
                    return "Done!";
                }
            } else {
                _isFinishedProgressing = true;
                return 'Response invalid';
            }
        } else {
            _isFinishedProgressing = true;
            return 'File error.';
        }
    }

    this.endInterval = function() {
        if (_interval){
            clearInterval(_interval);
            this.endAjaxRequest();
        }
    }
    
    this.startInterval = function() {
        if (_isFinishedProgressing) {
            _interval = setInterval("thumbBarProgress.startAjaxRequest();",100);
        }
    }

    this.startAjaxRequest = function() {
        this.endAjaxRequest();
        _ajaxRequest = new XMLHttpRequest();
        _ajaxRequest.open('GET', 'thumbsbar.php?q=progress', true);
        _ajaxRequest.onreadystatechange = this.ajaxReturn; 
        _ajaxRequest.send(null);	
    }

    this.endAjaxRequest = function() {
        if (_ajaxRequest) {
            _ajaxRequest.abort();
            _ajaxRequest=null;
        }
        _isFinishedProgressing = true;
    }
    
}

var thumbBarProgress;

function startRequestInterval() {
    if (!thumbBarProgress.isProcessing()) {
        thumbBarProgress.startInterval();
    }

}

function startCreatingThumbnails() {
    if (!thumbBarProgress.isProcessing()) {
        if (createThumbsBar()) 
        {
            startRequestInterval();
        }
    }
}

window.onload = function() {
    thumbBarProgress = new ThumbBarProgress(document.getElementById('progressbar_output'));  
};