let canvas;
let ctx;
let heart = new Image();
let zoff = 0;
let heartAlpha = .2;
let heartScale = 1;
let delay = 600;
let beating = false;

document.addEventListener("DOMContentLoaded", () => {
  // Display Time
  let timeContainer = document.getElementById("time");
  const clock = window.setInterval(() => {
    let time = new Date();
    timeContainer.innerHTML = time.getHours() + ":" + time.getMinutes() + " Uhr";
  }, 5000);

  // Mode Slider
  const mSlider = document.getElementById("modeSlider");
  const labels = document.querySelectorAll("#mode span");
  let c1 = "rgb(41, 41, 41)";
  let c2 = "rgb(239, 84, 87)";
  labels[1].style.color = c1;
  mSlider.addEventListener("input", (_event) => {
    for (let i = 0; i < labels.length; i++) {
      i === parseFloat(mSlider.value) ? labels[i].style.color = c1 : labels[i].style.color = c2;
    }
    if (mSlider.value == 0) {
      setColor(defaultColor);
      locked = true;
    } else {
      locked = false;
    }
  });

  // Brightness Slider
  const bSlider = document.getElementById("brightnessSlider");
  const sliderValue = document.getElementById("sliderValue");
  bSlider.addEventListener("input", (_event) => {
    sliderValue.style.width = map(bSlider.value, parseFloat(bSlider.getAttribute("min")), parseFloat(bSlider.getAttribute("max")), 10, 100) + "%";
  });

  // Canvas Stuff
  canvas = document.getElementById("ctx1");
  ctx = canvas.getContext("2d");

  ctx.translate(200, 200);

  heart.src = "img/heart-full.svg";
  heart.onload = function () {
    window.requestAnimationFrame(animation);
    ctx.drawImage(heart, -65, -60, 130, 120);
  }

  engine();
});

function animation() {
  ctx.clearRect(-ctx.canvas.width / 2, -ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = 1;
  // ctx.filter = "blur(10px)";
  let radius = 150;
  ctx.beginPath();
  for (let a = 0; a < (Math.PI * 2); a += .1) {
    let xoff = Math.cos(a);
    let yoff = Math.sin(a);
    let offset = map(noise.perlin3(xoff, yoff, zoff), 0, 1, -5, 5);
    let r = radius + offset;
    let x = Math.cos(a) * r;
    let y = Math.sin(a) * r;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = COLOR;
  ctx.fill();

  // ctx.filter = "none";
  ctx.globalAlpha = heartAlpha;
  ctx.save();
  ctx.scale(heartScale, heartScale);
  ctx.drawImage(heart, -65, -60, 130, 120);
  ctx.restore();
  zoff += 0.01

  window.requestAnimationFrame(animation);
}

function heartBeat() {
  heartAlpha = 1;
  heartScale = 1.1;
  const fadeOut = window.setInterval(() => {
    heartAlpha *= .9;
    heartScale *= .995; // Nich so schnufte aber tut :p
    if (heartAlpha <= .2) {
      clearInterval(fadeOut);
    }
  }, 40);
}

function engine() {
  if (beating && !locked) {
    heartBeat();
  }
  window.setTimeout(engine, delay);
}

function map(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}