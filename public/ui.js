let canvas;
let ctx;
let heart = new Image();
let zoff = 0;
let beating = false;

document.addEventListener("DOMContentLoaded", () => {
  // Uhrzeit
  let timeContainer = document.getElementById("time");
  window.setInterval(() => {
    let time = new Date();
    timeContainer.innerHTML = time.getHours() + ":" + time.getMinutes() + " Uhr";
  }, 5000);

  // On-Off Slider
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

  // Canvas Stuff
  canvas = document.getElementById("ctx1");
  ctx = canvas.getContext("2d");

  ctx.translate(200, 200);

  heart.src = "img/heart-full.svg";
  heart.onload = function () {
    window.requestAnimationFrame(animation);
    ctx.drawImage(heart, -65, -60, 130, 120);
  }

  // SOCKET Stuff
  SOCKET.on("touch", _data => beating = _data);
});

function animation() {
  ctx.clearRect(-ctx.canvas.width / 2, -ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = .4;

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

  if(beating && !locked) {
    ctx.globalAlpha = .6;
  }
  ctx.drawImage(heart, -65, -60, 130, 120);
  
  zoff += 0.01;
  window.requestAnimationFrame(animation);
}

function map(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}