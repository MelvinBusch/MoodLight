class ColorPicker {

  constructor() {
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.photo = document.getElementById("photo");
    this.startbutton = document.getElementById("startbutton");
    this.width = 320;
    this.height = 0;
    this.streaming = false;
    this.setup();
  }

  setup() {
    // Setup Video Stream
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    }).then(_stream => {
      this.video.srcObject = _stream;
      this.video.play();
    }).catch(_err => {
      console.error("An error occurred: " + _err);
    });
  
    // Show Video on Screen
    this.video.addEventListener("canplay", _event => {
      if (!this.streaming) {
        this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
        this.video.setAttribute("width", this.width);
        this.video.setAttribute("height", this.height);
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
        this.streaming = true;
      }
    });
  }

  getAverageColor() {
    let context = this.canvas.getContext("2d");
    if (this.width && this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      context.drawImage(this.video, 0, 0, this.width, this.height);
  
      let imgData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      let data = imgData.data;
  
      let r = 0;
      let g = 0;
      let b = 0;
      let num = 0;
  
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        num++;
      }
  
      let ar = Math.floor(r / num);
      let ag = Math.floor(g / num);
      let ab = Math.floor(b / num);
  
      let hsl = this.RGBToHSL(ar, ag, ab);
      return {"H": hsl.H, "S": hsl.S, "L": hsl.L};
  
      // let data = canvas.toDataURL("image/png");
      // photo.setAttribute("src", data);
    } else {
      console.warn("Something's wrong :(");
    }
  }

  RGBToHSL(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;
  
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b)
    let delta = cmax - cmin;
    let h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;

    else if (cmax == r)
      h = ((g - b) / delta) % 6;

    else if (cmax == g)
      h = (b - r) / delta + 2;

    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    // Calculate lightness
    l = (cmax + cmin) / 2;
  
    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return {"H": h, "S": s, "L": l};
  }
}