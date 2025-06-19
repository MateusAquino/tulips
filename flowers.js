const tulips = document.getElementById("tulips");
const tulipVersions = 20;

function newTulip(id, r, g, b) {
  const tulip = document.createElement("div");
  const version = (id % tulipVersions) + 1;
  const safeVersion = version < 10 ? `0${version}` : version;
  tulip.className = "tulip";
  tulip.innerHTML = `<svg class="tulip" xmlns="http://www.w3.org/2000/svg">
    <filter id="tulip-${id}">
      <feColorMatrix type="matrix" values="${1.1*r+0.25} 0 0 0 0  ${1.1*g} 1 0 0 0  ${1.1*b} 0 1 0 0  0 0 0 1 0"/>
    </filter>
    <image href="images/tulips/tulip_${safeVersion}.png" filter="url(#tulip-${id})" width="100%" height="100%" />
  </svg>`;
  return tulip;
}

function sfc32(a, b, c, d) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

const seed = 13;
const seedA = 2181156859 - seed;
const seedB = 1464473438 - 3 * seed;
const seedC = 2276782023 - 5 * seed;
const seedD = 4216827664 - 7 * seed;
const rnd = sfc32(seedA, seedB, seedC, seedD);

const startDate = moment([2023, 9, 24]);
const diff = moment().diff(startDate, "months");
document.querySelector("#flowerCount").innerText = diff;

const months = {
  January: "Janeiro",
  February: "Fevereiro",
  March: "Março",
  April: "Abril",
  May: "Maio",
  June: "Junho",
  July: "Julho",
  August: "Agosto",
  September: "Setembro",
  October: "Outubro",
  November: "Novembro",
  December: "Dezembro",
};

function addFlower(n, x, y, color, s, i, r) {
  const flowerH = color * 360;
  const flowerS = 80 + s * 20;
  const flowerL = 65 + i * 25;
  const [flowerR, flowerG, flowerB] = hslToRgb(
    flowerH / 360,
    0.9*(flowerS / 100),
    0.75*(flowerL / 100)
  );
  const flower = newTulip(n, flowerR, flowerG, flowerB);
  flower.style = `--color: hsl(${flowerH}, ${flowerS}%, ${
    flowerL
  }%); --dark-color: hsl(${flowerH}, ${30 + s * 20}%, ${
    50 + i * 25
  }%); --size: ${1 - 0.6 * y}; --rotation: ${11 - r * 22}deg;`;
  flower.style.left = `calc(${x * 96}vw)`;
  flower.style.bottom = `calc(${22 * y - 3}vh / 2)`;
  flower.style.zIndex = 10000 - Math.floor(100 * y);
  flower.onclick = () => {
    document.getElementById("isCurrent").style.display =
      n + 1 === diff ? "inline" : "none";
    document.getElementById("flowerNumber").innerText = n + 1;
    const formatedDate = startDate
      .clone()
      .add(n + 1, "months")
      .format("MMMM YYYY");

    document.getElementById("flowerDate").innerText = `${
      months[formatedDate.split(" ")[0]]
    } ${formatedDate.split(" ")[1]}`;
    document.getElementById("show-flower").innerHTML = flower.outerHTML;
  };

  tulips.appendChild(flower);
  return flower;
}

const { abs, min, max } = Math;

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }

  return [r, g, b];
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}


let lastFlower;
for (x = 0; x < diff; x++) {
  lastFlower = addFlower(x, rnd(), rnd(), rnd(), rnd(), rnd(), rnd());
}
lastFlower.click();

let touchstartY = 0;
let opacity = 1;

function setUIOpacity(touchendY) {
  if (touchendY === 0) return;
  const diff = touchendY - touchstartY;
  opacity = Math.max(0, Math.min(1, opacity - diff / 2000));
  const root = document.querySelector(":root");
  root.style.setProperty("--ui-opacity", `${opacity}`);
}

document.addEventListener(
  "touchstart",
  (e) => (touchstartY = e.changedTouches[0].screenY)
);

document.addEventListener("touchmove", (e) =>
  setUIOpacity(e.changedTouches[0].screenY)
);

document.addEventListener("dragstart", (e) => (touchstartY = e.screenY));
document.addEventListener("drag", (e) => setUIOpacity(e.screenY));
document.addEventListener("dblclick", (e) => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
});
