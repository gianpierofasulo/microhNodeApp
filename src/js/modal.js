// Get the modal
//import Button from "/components/button/button";

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
const apiUrl = 'http://192.168.1.12/api/mqtt_command.php?device=dispenser&method=dispense';

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
if(btn == null){
    btn = document.getElementsByTagName('x-button');
    //btn = Button.getShadow();
    for(let b of btn){
        //console.log(b);
        b.onclick = function() {
            modal.style.display = "block";
            const progress = document.querySelector("x-progress-bar");
            if(progress){
                let node = progress.shadowRoot.childNodes[1];
                progress.shadowRoot.removeChild(node)
                //console.log(node);
            }
        }

    }
}



// When the user clicks on the button, open the modal
// Set the date we're counting down to
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            timer = duration;
            //console.log('title')
            window.location.href = '/screensaver';
        }
    }, 1000);
}



