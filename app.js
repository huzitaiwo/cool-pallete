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

    // generate color with chromajs
    // const hexColor = chroma.random();
    // return hexColor
}

// check text color contrast
function checkContrast(color, text) {
    const luminance = chroma(color).luminance();
    if(luminance > 0.5) {
        text.style.color = '#000';
    } else {
        text.style.color = '#fff';
    }
}

function randomColors() {
    colorsDiv.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        // add color to background
        div.style.background = randomColor;
        hexText.textContent = randomColor;

        // check text contrast
        checkContrast(randomColor, hexText);

        // initilize colorize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSlider(color, hue, brightness, saturation)
    });
}

function colorizeSlider(color, hue, brightness, saturation) {
    // scale sturation
    const noSaturation = color.set('hsl.s', 0);
    const fullSaturation = color.set('hsl.s', 1);
    const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation]);

    // scale Brightness
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);

    // scale hue

    // update input-range colors

    // saturation
    saturation.style.background = `linear-gradient(to right, ${scaleSaturation(0)}, ${scaleSaturation(1)})`;
    // brightness
    brightness.style.background = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
}

randomColors();