
// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button

let button1 = document.querySelector('#button1');
let button2 = document.querySelector('#button2');
let button3 = document.querySelector('#button3');
let button4 = document.querySelector('#button4');
let log = document.querySelector('#log');
button1.addEventListener('mouseup', logMouseButton1);
button2.addEventListener('mouseup', logMouseButton2);
button3.addEventListener('mouseup', logMouseButton3);
button4.addEventListener('mouseup', logMouseButton4);

function logMouseButton1(e) {
    if (typeof e === 'object') {
        switch (e.button) {
        case 0:
            var onClickButton ='lodging';
            log.textContent = 'Button clicked ID:'+ this.id + 'Value' + onClickButton;

            break;
        case 1:
            log.textContent = 'Middle button clicked.';
            break;
        case 2:
            log.textContent = 'Right button clicked.';
            break;
        default:
            log.textContent = `Unknown button code: ${btnCode}`;
        }
  }
}
function logMouseButton2(e) {
    if (typeof e === 'object') {
        switch (e.button) {
        case 0:
            log.textContent = 'Button clicked ID:'+ this.id + 'Left button clicked.';
            break;
        case 1:
            log.textContent = 'Middle button clicked.';
            break;
        case 2:
            log.textContent = 'Right button clicked.';
            break;
        default:
            log.textContent = `Unknown button code: ${btnCode}`;
        }
    }
}
function logMouseButton3(e) {
    if (typeof e === 'object') {
        switch (e.button) {
        case 0:
            log.textContent = 'Button clicked ID:'+ this.id + 'Left button clicked.';
            break;
        case 1:
            log.textContent = 'Middle button clicked.';
            break;
        case 2:
            log.textContent = 'Right button clicked.';
            break;
        default:
            log.textContent = `Unknown button code: ${btnCode}`;
        }
    }
}
function logMouseButton4(e) {
    if (typeof e === 'object') {
        switch (e.button) {
        case 0:
            log.textContent = 'Button clicked ID:'+ this.id + 'Left button clicked.';
            break;
        case 1:
            log.textContent = 'Middle button clicked.';
            break;
        case 2:
            log.textContent = 'Right button clicked.';
            break;
        default:
            log.textContent = `Unknown button code: ${btnCode}`;
        }
    }
}
