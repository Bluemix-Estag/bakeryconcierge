






$('#translate').on('click', function (e) {
    var user_input = $('#input').val();
    var navegador = null;
    e.preventDefault();
    var selecionado = $('#select').val();

    if (selecionado != undefined) {
        $('#loader').removeClass('hide');
        $('#user').addClass('hide');
        // load_gif('translate-icon');

    }

    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        if (user_input != null || user_input != 'undefined' && result.verified == true) {
            var user_input = $('#input').val();
            var selecionado = $('#select').val();

            var audio = '<audio src="https://mobilevision.mybluemix.net/edspeech?text=' + user_input + '" autobuffer id="frame" oncanplay="myOnCanPlayFunction()" oncanplaythrough="myOnCanPlayThroughFunction()"  onloadeddata="myOnLoadedData()"></audio>';
            document.getElementById('audio').innerHTML = audio;
            var frame = document.getElementById('audio').innerHTML = audio;


            document.getElementById('frame').play();
        } else {
            alert('User input is null');
        }
    } else {

        if (user_input != null || user_input != 'undefined' && result.verified == true) {
            var user_input = $('#input').val();
            var selecionado = $('#select').val();
            var audio = '<audio src="https://cury-red.mybluemix.net/translate?text=' + user_input + '&idioma=' + selecionado + '" autobuffer id="frame" oncanplay="myOnCanPlayFunction()" oncanplaythrough="myOnCanPlayThroughFunction()"  onloadeddata="myOnLoadedData()"></audio>';
            document.getElementById('audio').innerHTML = audio;
            var frame = document.getElementById('audio').innerHTML = audio;
            document.getElementById('frame').play();
        } else {
            alert('User input is null');
        }
    }
})