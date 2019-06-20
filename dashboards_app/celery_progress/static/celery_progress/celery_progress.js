var CeleryProgressBar = (function () {
    function onSuccessDefault(progressBarElement, progressBarMessageElement) {
        progressBarElement.style.backgroundColor = '#76ce60';
        progressBarMessageElement.innerHTML = "Success!";
    }

    function onErrorDefault(progressBarElement, progressBarMessageElement) {
        progressBarElement.style.backgroundColor = '#dc4f63';
        progressBarMessageElement.innerHTML = "Error, something went wrong in your Python Execution Function!";
    }

    function onErrorAJAX(progressBarElement, progressBarMessageAjaxElement,error_message) {
        progressBarElement.style.backgroundColor = '#d2dc17';

        progressBarMessageAjaxElement.innerHTML = error_message;
    }

    function onProgressDefault(progressBarElement, progressBarMessageElement, progress) {
        progressBarElement.style.backgroundColor = '#68a9ef';
        progressBarElement.style.width = progress.percent + "%";
        progressBarMessageElement.innerHTML = progress.current + ' of ' + progress.total + ' processed.';
    }

    function updateProgress (progressUrl, options) {
        options = options || {};
        var progressBarId = options.progressBarId || 'progress-bar';
        var progressBarMessage = options.progressBarMessageId || 'progress-bar-message';


        var progressBarElement = options.progressBarElement || document.getElementById(progressBarId);
        var progressBarMessageElement = options.progressBarMessageElement || document.getElementById(progressBarMessage);

        var onProgress = options.onProgress || onProgressDefault;
        var onSuccess = options.onSuccess || onSuccessDefault;
        var onError = options.onError || onErrorDefault;
        var onErrorAJax=options.onErrorAjax || onErrorAJAX;
        var pollInterval = options.pollInterval || 500;

        var progressBarMessageAjax=options.progressBarMessageIdAjax || 'progress-bar-message-ajax';
        var progressBarMessageAjaxElement = options.progressBarMessageAjax || document.getElementById(progressBarMessageAjax);

        fetch(progressUrl).then(function(response) {
            response.json().then(function(data) {

                if (data.progress) {
                    onProgress(progressBarElement, progressBarMessageElement, data.progress);
                    // Plot graph when graph metadata exists
                    if(data.progress.other_meta) {
                        try{
                            window[data.progress.other_meta['ajax_function']](data.progress.other_meta);
                        }
                        catch (e) {
                            onErrorAJax(progressBarElement, progressBarMessageAjaxElement,"Error on your ajax function: " +e);
                        }

                    }
                }
                if (!data.complete) {
                    setTimeout(updateProgress, pollInterval, progressUrl, options);
                } else {

                    if (data.success) {

                        onSuccess(progressBarElement, progressBarMessageElement);
                    } else {
                        
                        onError(progressBarElement, progressBarMessageElement);
                    }
                }
            });
        });
    }
    return {
        onSuccessDefault: onSuccessDefault,
        onErrorDefault: onErrorDefault,
        onProgressDefault: onProgressDefault,
        updateProgress: updateProgress,
        initProgressBar: updateProgress,  // just for api cleanliness
    };
})();
