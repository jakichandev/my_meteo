const searchBox = document.querySelector("input.searchBox");
const submitSearch = document.querySelector("button.submitSearch");
const header = document.querySelector("section.main");

const weatherBox = {
  loading: document.querySelector("div.loading-box"),
  box: document.querySelector("div.forecast-box"),
  city: document.querySelector("h4.city"),
  country: document.querySelector("span.country"),
  temp: document.querySelector("span.temp"),
  icon: document.querySelector("img.icon-temp"),
  description: document.querySelector("p.description"),
  humidity: document.querySelector("span.humidity"),
  windSpeed: document.querySelector("span.wind-speed"),
  secondayInfoBox: document.querySelector("ul#box-secondary-info"),
};

const positionWeather = () => {
  weatherBox.loading.classList.remove("invisible");
  searchBox.value = "";

  const geoLocation = navigator.geolocation.getCurrentPosition(async (pos) => {
    lat = pos.coords.latitude;
    long = pos.coords.longitude;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=2af05a035ace3fa63f8f71eebeeab844`
    );
    const responseData = await response.json();
    weatherBox.loading.classList.add("invisible");
    chooseIconForWeather(responseData);
    weatherBox.city.textContent = responseData.name;
    weatherBox.country.textContent = responseData.sys.country;
    weatherBox.temp.textContent = `${Math.trunc(responseData.main.temp)}°`;
    setSecondaryInfo(responseData);
  });
};

positionWeather();
searchBox.focus();

const getCityWeather = async (place) => {
  weatherBox.loading.classList.remove("invisible");

  if (place.error === true || place.length === 0) return displayError(place);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${place[0].lat}&lon=${place[0].lon}&units=metric&appid=2af05a035ace3fa63f8f71eebeeab844`
    );
    if (!response.ok) throw new Error("problema nella richiesta");
    const responseData = await response.json();
    console.log(responseData);
    weatherBox.loading.classList.add("invisible");
    weatherBox.city.textContent = place[0].name;
    weatherBox.country.textContent = responseData.sys.country;
    weatherBox.temp.textContent = `${Math.trunc(responseData.main.temp)}°`;
    setSecondaryInfo(responseData);
    chooseIconForWeather(responseData);
  } catch (error) {
    console.log(error);
  }
};

const displayError = (place) => {
  weatherBox.secondayInfoBox.style.display = "none";
  weatherBox.city.textContent = place.message;
  weatherBox.temp.textContent = "";
  weatherBox.country.textContent = "";
  weatherBox.description.textContent = "";
  weatherBox.humidity.textContent = "";
  weatherBox.windSpeed.textContent = "";
  srcIcon("warning.svg");
  weatherBox.loading.classList.add("invisible");
};

const searchCity = async () => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${searchBox.value}&limit=1&appid=2af05a035ace3fa63f8f71eebeeab844`
    );
    if (!response.ok) {
      throw new Error("Richiesta andata male...");
    }
    const responseGeoData = await response.json();
    if (responseGeoData.length === 0) throw new Error();
    return responseGeoData;
  } catch (error) {
    return {
      error: true,
      message: "Not Found",
    };
  }
};

const changeImage = (image) => {
  console.log(image);
  header.style.setProperty("--boxAfterBgImage", `url(../assets/img/${image})`);
};

const setSecondaryInfo = (data) => {
  weatherBox.secondayInfoBox.style.display = "flex";
  weatherBox.humidity.textContent = `${data.main.humidity}%`;
  weatherBox.windSpeed.textContent = `${data.wind.speed} km/h`;
};

const chooseIconForWeather = (data) => {
  switch (data.weather[0].main) {
    case "Clouds":
      srcIcon("clouds.svg");
      weatherBox.description.textContent = "Nuvoloso";
      changeImage("clouds_image.jpg");
      break;
    case "Rain":
      srcIcon("rain.svg");
      weatherBox.description.textContent = "Pioggia";
      changeImage("rain_image.jpg");
      break;
    case "Drizzle":
      srcIcon("drizzle.svg");
      weatherBox.description.textContent = "Pioggia leggera";
      changeImage("rain_image.jpg");
      break;
    case "Clear":
      srcIcon("sun.svg");
      weatherBox.description.textContent = "Soleggiato";
      changeImage("sun_image.jpg");
  }
};

const srcIcon = (img) => {
  weatherBox.icon.style = "width: 150px;";
  weatherBox.icon.src = `./assets/img/${img}`;
};

submitSearch.addEventListener("click", async () => {
  let place = await searchCity();
  getCityWeather(place);
  searchBox.value = "";
  searchBox.focus();
});
