function ThumbBarProgress (outputDiv) {
    var _outputDiv = outputDiv;
    var _ajaxRequest;
    var _interval;
    var _isFinishedProgressing;

    this.ajaxReturn = function () {
        if (_ajaxRequest && _ajaxRequest.readyState==4) {
            var ajaxCallSuccessful = _ajaxRequest.status==200;
            if (ajaxCallSuccessful) {
                var response = _ajaxRequest.responseText;
                _outputDiv.innerHTML = handleResponse(response);
            } else {
                _outputDiv.innerHTML= 'Ajax error';
                _isFinishedProgressing = true;
            }
            if (_isFinishedProgressing) {
                endInterval();
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
            endAjaxRequest();
        }
    }
    
    this.startInterval = function() {
        if (_isFinishedProgressing) {
            _interval = setInterval("startAjaxRequest();",500);
        }
    }

    this.startAjaxRequest = function() {
        endAjaxRequest();
        _ajaxRequest = new XMLHttpRequest();
        _ajaxRequest.open('GET', 'thumbsbar.php?q=progress', true);
        _ajaxRequest.onreadystatechange = ajaxReturn; 
        _ajaxRequest.send(null);	
    }

    this.endAjaxRequest = function() {
        if (_ajaxRequest) {
            _ajaxRequest.abort();
            _ajaxRequest=null;
        }
        _isFinishedProgressing = true;
    }
    
    function ThumbBarProgress(outputDiv) {
        if (window.XMLHttpRequest) {
            _outputDiv = outputDiv;
            _isFinishedProgressing = true;
        } else {
            throw new Error("XMLHttpRequest not supported");
        }
    }

}

function startRequestInterval() {
    var thumbBarProgress = new ThumbBarProgress(document.getElementById('progressbar2'));
    thumbBarProgress.startInterval();
}