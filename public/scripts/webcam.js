(function () {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 200; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        // photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia({
                video: true,
                audio: false
            },
            function (stream) {
                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    video.src = vendorURL.createObjectURL(stream);
                }
                video.play();
            },
            function (err) {
                console.log("An error occured! " + err);
            }
        );

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function (ev) {
            document.getElementById('result').innerText = '';
            takepicture();
            ev.preventDefault();
        }, false);

        clearphoto();
    }

    // Fill the photo with an indication that none has been
    // captured.

    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        // photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            // photo.setAttribute('src', data);

            var buffered = data.replace(/^data:image\/(png|jpg);base64,/, "");
            var buffer = _base64ToArrayBuffer(buffered);
            identifyPhoto(buffer);
        } else {
            clearphoto();
        }
    }

    function formFormat(buffer) {
        var form = new FormData('file', buffer);
        return form;
    }


    function _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function convertCanvas(image) {
        xhrPhoto('/convertcanvas?query=teste', image, function (result) {
            // console.log('foi');
            console.log(typeof image);
        }, function (err) {
            console.log('error');
        })
    }



    function identifyPhoto(data) {
        xhrPhoto('https://mobilevision.mybluemix.net/edpost', data, function (result) {
            var result = JSON.parse(result);
            var tempo = JSON.stringify(result.time);

            var date = new Date(result.time * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
            // Hours part from the timestamp
            // var hours = date.getHours();

            var hours = date.split(' ')[1];

            var hour = hours.split(':')[0];
            console.log(hour);
            console.log('Photo sent.')
            if (result.type != null || result.type == '') {
                document.getElementById('result').innerText = JSON.stringify(result.type);
                var audio = '<audio src="https://mobilevision.mybluemix.net/edspeech?text=' + result.type + '" autobuffer id="frame" "></audio>';
                document.getElementById('audio').innerHTML = audio;
                var frame = document.getElementById('audio').innerHTML = audio;
                document.getElementById('frame').play();

            } else {
                document.getElementById('result').innerText = "Not authorized"
            }

        }, function (err) {
            console.log('error')
        })
        // xhrPhoto('http://9.86.210.202:1880/edison', data, function (result) {
        //     console.log('foi')
        //     console.log(data);
        // }, function (err) {
        //     console.log('error')
        // })
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();