'use strict'



let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stream,
  recorder,
  counter = 1,
  chunks,
  media;

// gUMbtn.onload = e => {
//   let mediaOptions = {
//     audio: {
//       tag: 'audio',
//       type: 'audio/wav',
//       ext: '.wav',
//       gUM: {
//         audio: true
//       }
//     }
//   };
//   media = mediaOptions.audio;
//   navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
//     stream = _stream;
//     recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = e => {
//       chunks.push(e.data);
//       if (recorder.state == 'inactive') makeLink();
//     };
//     log('got file successfully');
//   }).catch(log);
// }

start.onmousedown = e => {
  e.preventDefault();
  var selected = $('#identified').val();
  if(selected == '' || selected == null){
    alert('Please Select a language to translate from.')
  }else{
    $('.progress').removeClass('hide');
  console.log('onmousedown');
  toggleRecording(start);
  // chunks = [];
  // recorder.start();
  }
  

}

start.onmouseup = e => {
  e.preventDefault();
  $('.progress').addClass('hide');
  toggleRecording(start);
  // recorder.stop();
  // load_gif('start');
}


start.ontouchstart = e => {
  if(selected == '' || selected == null){
    alert('Please Select a language to translate from.')
  }else{
    $('.progress').removeClass('hide');
  console.log('onmousedown');
  toggleRecording(start);
  // chunks = [];
  // recorder.start();
  }

}

start.ontouchend = e => {
  e.preventDefault();
  $('.progress').addClass('hide');
  toggleRecording(start);
  console.log($('#switch').val());
  // recorder.stop();
  // load_gif('start');
}

// function makeLink() {

//   let blob = new Blob(chunks, {
//       type: media.type
//     }),
//     url = URL.createObjectURL(blob);
//   var spoken = document.getElementById('identified').value;
//   var formData = new FormData();
//   formData.append("file", blob);

//   // xhrPostNoJSON('https://cury-red.mybluemix.net/speech?spoken=' + spoken, formData, function (result) {
//   //   console.log('entrou no send audio com' + audio)
//   //   var resultado = result;
//   //   document.getElementById('input').value = resultado;
//   //   stop_gif();
//   //   var selected = document.getElementById('select').value;
//   //   if (selected != '' || selected != null) {
//   //     $('#translate').prop("disabled", false);
//   //     $('#' + selected).prop('selected', true);
//   //     $('select').material_select('update');
//   //   }

//   // }, function (err) {
//   //   alert(err);
//   // }, null);



//   xhrPostNoJSON('/speech', formData, function (result) {
    
//     console.log(result);
    
    

//   }, function (err) {

//   });





  // xhrAttach('/speech', formData, function (result) {
  //   // input = new Uint8Array(result.buffer.data);
  //   // var str = '';
  //   // for (var i = 0; i < input.byteLength; i++)
  //   //   str = str + String.fromCharCode(input[i]);

  //   // var image = document.getElementById("image");
  //   // image.src = 'data:image/png;base64,' + btoa(str);

  //   console.log(typeof result);
  //   console.log(result);

  // }, function (err) {

  // })

