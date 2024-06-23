const halfLunarAge = 14.76529385288;
const invertMoon = true;

function setTimePercent(time, lunarTime) {
  if (invertMoon) {
    lunarTime += halfLunarAge;
    if (lunarTime > halfLunarAge * 2) {
      lunarTime -= halfLunarAge * 2;
    }
  }
  const hours = Math.floor(time * 24);
  const minutes = Math.floor((time * 24 - hours) * 60);
  const span = document.getElementById("timeValue");
  span.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const span2 = document.getElementById("percentValue");
  span2.innerHTML = `(${Math.floor(-time * 2400)}%)`;

  const root = document.querySelector(":root");
  root.style.setProperty("--s", `${-time * 2400}%`);
  root.style.setProperty("--p", `${-time}`);
  root.style.setProperty(
    "--l",
    `${1 - Math.abs(lunarTime - halfLunarAge) / halfLunarAge}`
  );

  const sunrise = SunriseSunsetJS.getSunrise(-23.234536, -45.92584308055668);
  const sunriseHours = sunrise.getHours();
  const sunriseMinutes = sunrise.getMinutes();
  const sunrisePercent = -675;
  const sunset = SunriseSunsetJS.getSunset(-23.234536, -45.92584308055668);
  const sunsetHours = sunset.getHours();
  const sunsetMinutes = sunset.getMinutes();
  const sunsetPercent = -1750;
}

function updateNow() {
  const lunarAge = s.lunarAgePercent(); // returns 0-1
  const now = new Date();
  const todaySeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const dayPercent = todaySeconds / 86400; // returns 0-1
  setTimePercent(dayPercent, lunarAge);
  document.getElementById("time").value = dayPercent * 2400;
}

updateNow();
setInterval(updateNow, 100);

// slider for time
document.getElementById("time").oninput = function () {
  const time = this.value / 2400.0; // returns 0-1
  setTimePercent(time, time * halfLunarAge * 2);
};
