// DOM Elements
const colorPicker = document.getElementById('colorPicker');
const colorCode = document.getElementById('colorCode');
const sizeSlider = document.getElementById('sizeSlider');
const radiusSlider = document.getElementById('radiusSlider');
const distanceSlider = document.getElementById('distanceSlider');
const intensitySlider = document.getElementById('intensitySlider');
const shapeOptions = document.querySelectorAll('.shape-option');
const lightOptions = document.querySelectorAll('.light-option');
const previewBox = document.querySelector('.neumorphism-box');
const codeOutput = document.querySelector('.code-output');
const copyButton = document.getElementById('copyButton');

// State variables
let currentShape = 'flat';
let currentDirection = 'top-left';

// Helper Functions
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function shadeColor(color, percent) {
    const { r, g, b } = color;
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const newR = Math.round((t - r) * p) + r;
    const newG = Math.round((t - g) * p) + g;
    const newB = Math.round((t - b) * p) + b;
    return `rgb(${newR}, ${newG}, ${newB})`;
}

function updateColorInputs(value) {
    colorPicker.value = value;
    colorCode.value = value;
}

function updateSliderValues() {
    document.querySelector('label[for="sizeSlider"] .slider-value').textContent = `${sizeSlider.value}px`;
    document.querySelector('label[for="radiusSlider"] .slider-value').textContent = `${radiusSlider.value}px`;
    document.querySelector('label[for="distanceSlider"] .slider-value').textContent = `${distanceSlider.value}px`;
    document.querySelector('label[for="intensitySlider"] .slider-value').textContent = intensitySlider.value;
}

// Main Function to update neumorphism effect
function updateNeumorphism() {
    const color = colorPicker.value;
    const radius = radiusSlider.value;
    const distance = distanceSlider.value;
    const intensity = intensitySlider.value;
    const blur = Math.round(distance * 2);

    // Calculate the maximum size based on container width
    const maxSize = previewBox.parentElement.offsetWidth - 40;
    const size = Math.min(sizeSlider.value, maxSize);

    // Calculate lighter and darker shades of the selected color
    let rgbColor = hexToRgb(color);
    let darkerColor = shadeColor(rgbColor, -intensity);
    let lighterColor = shadeColor(rgbColor, intensity);

    // Set box shadow based on light direction
    let boxShadow = '';
    switch (currentDirection) {
        case 'top-left':
            boxShadow = `${distance}px ${distance}px ${blur}px ${darkerColor}, -${distance}px -${distance}px ${blur}px ${lighterColor}`;
            break;
        case 'top-right':
            boxShadow = `-${distance}px ${distance}px ${blur}px ${darkerColor}, ${distance}px -${distance}px ${blur}px ${lighterColor}`;
            break;
        case 'bottom-left':
            boxShadow = `${distance}px -${distance}px ${blur}px ${darkerColor}, -${distance}px ${distance}px ${blur}px ${lighterColor}`;
            break;
        case 'bottom-right':
            boxShadow = `-${distance}px -${distance}px ${blur}px ${darkerColor}, ${distance}px ${distance}px ${blur}px ${lighterColor}`;
            break;
    }

    // Set style based on selected shape
    let style = '';
    switch (currentShape) {
        case 'flat':
            style = `
border-radius: ${radius}px;
background: ${color};
box-shadow: ${boxShadow};`;
            break;
        case 'concave':
            style = `
border-radius: ${radius}px;
background: linear-gradient(145deg, ${darkerColor}, ${lighterColor});
box-shadow: ${boxShadow};`;
            break;
        case 'convex':
            style = `
border-radius: ${radius}px;
background: linear-gradient(145deg, ${lighterColor}, ${darkerColor});
box-shadow: ${boxShadow};`;
            break;
        case 'pressed':
            style = `
border-radius: ${radius}px;
background: ${color};
box-shadow: inset ${boxShadow};`;
            break;
    }

    // Apply styles to preview box
    previewBox.style.cssText = style;
    previewBox.style.width = `${size}px`;
    previewBox.style.height = `${size}px`;

    // Update code output
    codeOutput.value = `.neumorphism-box {${style}}`;
    
    // Update slider value displays
    updateSliderValues();
}

// Event Listeners
colorPicker.addEventListener('input', () => {
    updateColorInputs(colorPicker.value);
    updateNeumorphism();
});

colorCode.addEventListener('input', () => {
    if (/^#[0-9A-F]{6}$/i.test(colorCode.value)) {
        updateColorInputs(colorCode.value);
        updateNeumorphism();
    }
});

[sizeSlider, radiusSlider, distanceSlider, intensitySlider].forEach(slider => {
    slider.addEventListener('input', updateNeumorphism);
});

shapeOptions.forEach(option => {
    option.addEventListener('click', () => {
        shapeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        currentShape = option.dataset.shape;
        updateNeumorphism();
    });
});

lightOptions.forEach(option => {
    option.addEventListener('click', () => {
        lightOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        currentDirection = option.dataset.direction;
        updateNeumorphism();
    });
});

copyButton.addEventListener('click', () => {
    codeOutput.select();
    document.execCommand('copy');
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
        copyButton.textContent = 'Copy CSS';
    }, 2000);
});

// Initialize
updateNeumorphism();