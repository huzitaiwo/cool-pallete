// global slections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexs = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustmentBtn = document.querySelectorAll(".adjust");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const LockBtn = document.querySelectorAll(".lock");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;
// local storage
let savedPalettes = [];

// EVENT LISTENERS
generateBtn.addEventListener("click", randomColors);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, i) => {
  div.addEventListener("change", () => {
    updateTextUI(i);
  });
});

currentHexs.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});

adjustmentBtn.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    openAdjustmentPanel(i);
  });
});

closeAdjustments.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    closeAdjustmentPanel(i);
  });
});

LockBtn.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    lockColor(i);
  });
});

// FUNTIONS
// color Generator
function generateHex() {
  const letters = "0123456789ABCDEF";
  let hash = "#";
  for (let i = 0; i < 6; i++) {
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
  if (luminance > 0.5) {
    text.style.color = "#000";
  } else {
    text.style.color = "#fff";
  }
}

function randomColors() {
  // initial colors
  initialColors = [];

  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    if (div.classList.contains("locked")) {
      // store initil hexText value
      initialColors.push(hexText.textContent);
      return;
    } else {
      // add colors to array
      initialColors.push(chroma(randomColor).hex());
    }

    // add color to background
    div.style.background = randomColor;
    hexText.textContent = randomColor;

    // check text contrast
    checkContrast(randomColor, hexText);

    // initilize colorize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSlider(color, hue, brightness, saturation);
  });

  // reset inputs:range
  resetInput();

  // check button contrast
  adjustmentBtn.forEach((btn, i) => {
    checkContrast(initialColors[i], btn);
    checkContrast(initialColors[i], LockBtn[i]);
  });
}

function colorizeSlider(color, hue, brightness, saturation) {
  // scale sturation
  const noSaturation = color.set("hsl.s", 0);
  const fullSaturation = color.set("hsl.s", 1);
  const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation]);

  // scale Brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  // update input-range colors

  // saturation
  saturation.style.background = `linear-gradient(to right, ${scaleSaturation(
    0
  )}, ${scaleSaturation(1)})`;
  // brightness
  brightness.style.background = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  // hue
  hue.style.background = `linear-gradient(to right, rgb(201,75,75), rgb(204,204,75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75,75,204), rgb(204, 75, 204), rgb(204, 75, 75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgText = initialColors[index];

  let color = chroma(bgText)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.background = color;

  // coloriz input:sliders
  colorizeSlider(color, hue, brightness, saturation);
}

function updateTextUI(i) {
  const activeDiv = colorDivs[i];
  const color = chroma(activeDiv.style.background);
  const hexText = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  // change text hex code
  hexText.textContent = color.hex();
  // check Contrast
  checkContrast(color, hexText);
  for (icon of icons) {
    checkContrast(color, icon);
  }
}

function resetInput() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.textContent;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  // popup animation
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustmentPanel(i) {
  sliderContainers[i].classList.toggle("active");
}

function closeAdjustmentPanel(i) {
  sliderContainers[i].classList.remove("active");
}

function lockColor(i) {
  colorDivs[i].classList.toggle("locked");
  const lockIcon = LockBtn[i].children[0];
  lockIcon.classList.toggle("fa-lock-open");
  lockIcon.classList.toggle("fa-lock");
}

// implement save to palette and local storage

const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closelibraryBtn = document.querySelector(".close-library");

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closelibraryBtn.addEventListener("click", closeLibrary);

function openPalette(e) {
  const popup = saveContainer.children[0];
  // console.log(popup);
  saveContainer.classList.add("active");
  popup.classList.add("active");
}

function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

function savePalette(e) {
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentHexs.forEach((hex) => {
    colors.push(hex.textContent);
  });
  // generate objects
  let paletteNr = savePalette.length;
  const paletteObj = { name, colors, nr: paletteNr };
  savedPalettes.push(paletteObj);
  // saved to local storage
  savetoLocal(paletteObj);
  saveInput.value = "";
  //   generate palette for the library
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.textContent = paletteObj.name;
  const preview = document.createElement("div");
  paletteObj.colors.forEach((smallColor) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.background = smallColor;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.textContent = "Select";

  //   append to library
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}

function savetoLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}

function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

randomColors();
