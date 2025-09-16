window.setup = setup;
window.draw = draw;
window.processInputs = processInputs;
let particles = [];
let num = 3000;
let noiseScale = 0.01;
let weatherData;
let lat;
let lon;


async function fetchWeather(lat, lon) {
    const apiKey = window.CONFIG.WEATHERSTACK_KEY;
    if (!apiKey) {
        // No API key, use offline sample
        try {
            const offlineResponse = await fetch('offline-weather-sample.json');
            const offlineData = await offlineResponse.json();
            return offlineData;
        } catch (offlineError) {
            console.error('Failed to load offline sample:', offlineError);
            return null;
        }
    }
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${lon}&units=f`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API fetch failed');
        const data = await response.json();
        if (!data.current) throw new Error('No weather data');
        return data;
    } catch (error) {
        console.warn('Falling back to offline sample:', error);
        try {
            const offlineResponse = await fetch('offline-weather-sample.json');
            const offlineData = await offlineResponse.json();
            return offlineData;
        } catch (offlineError) {
            console.error('Failed to load offline sample:', offlineError);
            return null;
        }
    }
}


function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);  // Set color mode to HSB
    for (let i = 0; i < num; i++) {
        particles.push(createVector(random(width), random(height)));
    }
    noiseSeed(1);
}

function draw() {
    // Default values in case weather data hasn't loaded yet
    let cloudCover = weatherData ? weatherData.current.cloudcover : 0;
    let temperature = weatherData ? weatherData.current.temperature : 32; 
    let uv_index = weatherData ? weatherData.current.uv_index : 6;
    let wind_dir = weatherData ? weatherData.current.wind_dir : 'N';
    let windSpeed = weatherData ? weatherData.current.wind_speed : 5;

    // Keep the background constant
    background(0);  // Dark background for contrast

    // Adjust stroke color and size based on temperature
    let tempColor = map(temperature, 0, 100, 0, 360); // scale from blue (0) to red (360)
    let alphaValue = map(cloudCover, 0, 100, 100, 20); 
    let particleSize = map(temperature, 0, 100, 1, 15); // larger particles for warmer temperatures
    stroke(tempColor, 100, 100, alphaValue);
    strokeWeight(particleSize);

    // Change noiseScale based on uv_index
    noiseScale = map(uv_index, 1, 11, 0.001, 0.01);

    // Alter particle speed based on wind speed
    let speedMultiplier = map(windSpeed, 0, 100, 1, 10);

    // Convert wind direction to angle in radians
    let windAngle = windDirectionToAngle(wind_dir);

    // Display particles
    for (let i = 0; i < num; i++) {
        let p = particles[i];
        point(p.x, p.y);
        let n = noise(p.x * noiseScale, p.y * noiseScale);
        let a = TAU * n;
        p.x += cos(a + windAngle) * speedMultiplier;
        p.y += sin(a + windAngle) * speedMultiplier;
        if (!onScreen(p)) {
            p.x = random(width);
            p.y = random(height);
        }
    }
}

function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

async function processInputs(inputOne, inputTwo){
    lat = inputOne;
    lon = inputTwo;
    weatherData = await fetchWeather(lat, lon);
    
}

// Convert wind direction to angle in radians
function windDirectionToAngle(dir) {
    switch(dir) {
        case 'N': return -HALF_PI;
        case 'NNE': return -HALF_PI + QUARTER_PI / 2;
        case 'NE': return -HALF_PI + QUARTER_PI;
        case 'ENE': return -HALF_PI + QUARTER_PI * 1.5;
        case 'E': return 0;
        case 'ESE': return QUARTER_PI / 2;
        case 'SE': return QUARTER_PI;
        case 'SSE': return QUARTER_PI * 1.5;
        case 'S': return HALF_PI;
        case 'SSW': return HALF_PI + QUARTER_PI / 2;
        case 'SW': return HALF_PI + QUARTER_PI;
        case 'WSW': return HALF_PI + QUARTER_PI * 1.5;
        case 'W': return PI;
        case 'WNW': return PI - QUARTER_PI / 2;
        case 'NW': return PI - QUARTER_PI;
        case 'NNW': return PI - QUARTER_PI * 1.5;
        default: return 0;  // Default to east if unknown
    }
}