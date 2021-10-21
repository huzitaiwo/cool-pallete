// global slections and variables
const colorsDiv = document.querySelectorAll('.color');
const generateBtn = document.querySelectorAll('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexs = document.querySelectorAll('.color h2');
// functions

// color Generator
function generateHex() {
    const letters = '0123456789ABCDEF';
    let hash = '#';
    for(let i = 0; i < 6; i++) {
        hash += letters[Math.floor(Math.random() * 16)];
    }
    return hash;

    /*
    const hexColor = chroma.random();
    return hexColor
    */
}

function checkContrast(color, text) {
    const luminance = chroma(color).luminance();
    if(luminance > 0.5) {
        text.style.color = 'black';
    } else {
        text.textContent = 'white';
    }
}

function randomColors() {
    colorsDiv.forEach((div, index) => {
        hexText = div.children[0];
        const randomColor = generateHex();

        // add color to background
        div.style.background = randomColor;
        hexText.textContent = randomColor;

        // check text contrast
        // checkContrast(randomColor, hexText);

        // initilize colorize slider
        // const color = chroma(randomColor);
    });
}

randomColors();