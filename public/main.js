const SOCKET = io.connect("http://localhost:3000");
const URL = "./MoodManager/";
const timeSteps = 2500;
const snow = [255, 0, 0];
const beach = [0, 127, 255];
const fields = [255, 200, 0];
const forest = [0, 255, 20];
const defaultColor = [60, 60, 60];
const colors = [snow, beach, fields, forest];
let current = defaultColor;
let blocked = false;
let locked = false;
let care = false;
let model, webcam, maxPredictions;
let COLOR = "rgb(60, 60, 60)";
let heartrate;

window.addEventListener("load", init);

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();
  await webcam.play();
  window.setTimeout(updatePrediction, timeSteps);
}

async function updatePrediction() {
  webcam.update();
  await predict();
  window.setTimeout(updatePrediction, timeSteps);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  // console.log(prediction);
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability.toFixed(2) > .9) {
      setColor(colors[i]);
      continue;
    }
  }
}

function setColor(_c) {
  let amt = 0;
  let temp = [];
  if (JSON.stringify(current) != JSON.stringify(_c) && !blocked && !locked && !care) {
    blocked = true;
    const interval = window.setInterval(() => {
      for (let i = 0; i < 3; i++) {
        temp[i] = lerp(current[i], _c[i], amt.toFixed(3));
      }
      if (amt >= 1) {
        clearInterval(interval);
        current = _c;
        blocked = false;
      } else {
        amt += .005;
      }
      COLOR = `rgb(${temp[0]}, ${temp[1]}, ${temp[2]})`;
      SOCKET.emit("changeColor", fullColorHex(temp[0], temp[1], temp[2]));
    }, 20);
  }
}

// Set Heart Rate Color
SOCKET.on("heartrate", (_data) => {
  heartrate = _data;
  let orange = [255, 127, 0];
  let rot = [255, 0, 0];
  // console.log(heartrate);
  if (beating) {
    if (heartrate > 550) {
      setColor(orange);
      care = true;
    } else if (heartrate < 100) {
      setColor(rot);
      care = true;
    } else {
      care = false;
    }
  } else {
    care = false;
  }
});

// Helper Functions
function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return ((1 - amount) * value1 + amount * value2).toFixed(2);
}

function rgbToHex(_c) {
  let hex = Math.round(_c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

function fullColorHex(r, g, b) {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return "#" + red + green + blue;
};