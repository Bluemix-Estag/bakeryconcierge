window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;


function saveAudio() {
    // audioRecorder.exportWAV(doneEncoding);
    // could get mono instead by saying
    audioRecorder.exportMonoWAV( doneEncoding );
}


function speechToText(blob){
    var blob = blob;
    var formData = new FormData();
    var service = document.getElementById('service').value;
    console.log('Service:' + service);
    var model =  document.getElementById('identified').value;
    formData.append('file', blob);
    xhrPostNoJSON('/speech?model='+model+'&service='+service, formData, function(result){
        if(result != null){
            displayResult(result);
        }else{
            alert('not found');
        }
        
    },function(err){
        console.log('erro');
    })
}

function gotBuffers(buffers) {

    // the ONLY time gotBuffers is called is right after a new recording is completed - 
    // so here's where we should set up the download.
    // audioRecorder.exportWAV(doneEncoding);
    audioRecorder.exportMonoWAV( doneEncoding );
}

function doneEncoding(blob) {
    // var audio = document.getElementById('myaudio');
    // audio.src = URL.createObjectURL(blob);
    //   audio.onload = function(evt) {
    //     URL.revokeObjectUrl(objectUrl);
    //   };
    // audio.play();
    speechToText(blob);// xhr
    // Recorder.setupDownload(blob, "myRecording" + ((recIndex < 10) ? "0" : "") + recIndex + ".wav");
    recIndex++;
}

function toggleRecording(e) {
        console.log('toggle recording')
    if (e.classList.contains("recording")) {
        // stop recording
        load_gif('start');
        // cancelAnalyserUpdates();
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffers(gotBuffers);
        console.log(gotBuffers);
    } else {
        // start recording
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
    }
}

function displayResult(result){
    var resultado = result;
    document.getElementById('input').value = resultado;
    stop_gif();
    // var selected = document.getElementById('select').value;
    // if (selected != '' || selected != null) {
      $('#translate').prop("disabled", false);
    //   $('#' + selected).prop('selected', true);
    //   $('select').material_select('update');
    // }
}



// function convertToMono(input) {
//     var splitter = audioContext.createChannelSplitter(2);
//     var merger = audioContext.createChannelMerger(2);

//     input.connect(splitter);
//     splitter.connect(merger, 0, 0);
//     splitter.connect(merger, 0, 1);
//     return merger;
// }

function cancelAnalyserUpdates() {
    window.cancelAnimationFrame(rafID);
    rafID = null;
}

function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 3;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData);

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor(i * multiplier);
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j < multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
            
            analyserContext.fillRect(i * SPACING, canvasHeight  , BAR_WIDTH, -magnitude);
        }
    }

    rafID = window.requestAnimationFrame(updateAnalysers);
}

// function toggleMono() {
//     if (audioInput != realAudioInput) {
//         audioInput.disconnect();
//         realAudioInput.disconnect();
//         audioInput = realAudioInput;
//     } else {
//         realAudioInput.disconnect();
//         audioInput = convertToMono(realAudioInput);
//     }

//     audioInput.connect(inputPoint);
// }

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect(analyserNode);
    audioRecorder = new Recorder(inputPoint);
    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect(zeroGain);
    zeroGain.connect(audioContext.destination);
    // updateAnalysers();
}

function initAudio() {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia({
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
    }, gotStream, function (e) {
        alert('Error getting audio');
        console.log(e);
    });
}

function load_gif(element){
     $('#'+element).addClass('pulse');
    document.getElementById(element).innerHTML = '';
    document.getElementById(element).innerHTML = '<div class="row"><div class="col s1"><div class="preloader-wrapper small active" id="loaded_gif">'+
            '<div class="spinner-layer spinner-red-only">'+
            '<div class="circle-clipper left">' +
        '<div class="circle"></div>' + 
      '</div><div class="gap-patch">' + 
        '<div class="circle"></div>' + 
      '</div><div class="circle-clipper right">' + 
        '<div class="circle"></div>' + 
      '</div>' + 
    '</div>' + 
  '</div></div></div>';
}

function stop_gif(){
    var service = document.getElementById('service').value;
    if(service == 'watson'){
        document.getElementById('start').innerHTML = '<img src="images/watson.png" width="30"  id="mic-btn">';
    }else{
        document.getElementById('start').innerHTML = '<img src="images/google.png" width="30"  id="mic-btn">';
    }
    
    $('#loaded_gif').addClass('hide');
    
}




window.addEventListener('load', initAudio);