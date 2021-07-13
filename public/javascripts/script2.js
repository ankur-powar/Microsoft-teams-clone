let element1 = document.querySelector('.chat-block');

let element2 = document.querySelector('.participant-block');

let element3 = document.querySelector('.video-block');

$(window).resize(function() {
    //console.log("Width: ",window.innerWidth);
    //console.log("Height: ",window.innerHeight);
    var w = window.innerWidth;
    if(element1.style.display == 'block' || element2.style.display == 'block'){
        if(w < 551) {
            element3.style.display = 'none';
            element3.style.flex = '1';
        } 
        else if(w < 801) {
            element3.style.display = 'block';
            element3.style.flex = '0.55';
        }
        else if(w < 1201) {
            element3.style.display = 'block';
            element3.style.flex = '0.65';
        }
        else {
            element3.style.display = 'block';
            element3.style.flex = '0.77';
        }
    }
});

function chatSlideOut(className) {
    if(className == 'chat-block') {
        element1 = document.querySelector('.chat-block');
        element2 = document.querySelector('.participant-block');
        console.log("SCROOL TO BOTTOM CALEED")
        scrollToBottom();
    } else{
        element1 = document.querySelector('.participant-block');
        element2 = document.querySelector('.chat-block');
    }
    element3.style.display = 'block';
    var w = window.innerWidth;
    if(element1.style.display == 'block'){
        element1.style.display = 'none';
        element2.style.display = 'none';
        element3.style.flex = '1';
    }
    else{
        element1.style.display = 'block';
        element2.style.display = 'none';
        element3.style.flex = '0.77';

        if(w < 551) {
            element3.style.display = 'none';
            element3.style.flex = '1';
        } 
        else if(w < 801) {
            element3.style.flex = '0.55';
        }
        else if(w < 1201) {
            element3.style.flex = '0.65';
        }
        else {
            element3.style.flex = '0.77';
        }
    }
}



