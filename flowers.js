const tulips = document.getElementById("tulips");
const tulip = document.createElement("div");
tulip.className = "tulip";
tulip.innerHTML =
  '<div class="stem"><div class="tulipHead"> <div class="tulipHair lightTulip lightTulip-1"></div> <div class="tulipHair darkTulip darkTulip-1"></div> <div class="tulipHair lightTulip lightTulip-2"></div> <div class="tulipHair darkTulip darkTulip-2"></div> <div class="tulipHair lightTulip lightTulip-3"></div> </div> <div class="rightTulipLeaf tulipLeaf leaf"></div> <div class="leftTulipLeaf tulipLeaf leaf"></div> <div class="rightStemLeaf stemLeaf leaf"></div> <div class="leftStemLeaf stemLeaf leaf"></div></div>';

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
  const flower = tulip.cloneNode(true);
  flower.style = `--color: hsl(${color * 360}, ${80 + s * 20}%, ${
    65 + i * 25
  }%); --dark-color: hsl(${color * 360}, ${30 + s * 20}%, ${
    50 + i * 25
  }%); --size: ${1 - 0.6 * y}; --rotation: ${11 - r * 22}deg;`;
  flower.style.left = `calc(${x * 96}vw)`;
  flower.style.bottom = `calc(${22 * y - 3}vh / 2)`;
  flower.style.zIndex = 10000 - Math.floor(100 * y);
  flower.onclick = () => {
    console.log(n, diff);
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

let lastFlower;
for (x = 0; x < diff; x++) {
  lastFlower = addFlower(x, rnd(), rnd(), rnd(), rnd(), rnd(), rnd());
}
lastFlower.click();
