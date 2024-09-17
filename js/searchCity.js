const searchBox = document.querySelector("input.searchBox");
const submitSearch = document.querySelector("button.submitSearch");
const weatherBox = {
  city: document.querySelector("h4.city"),
  country: document.querySelector("span.country"),
  temp: document.querySelector("span.temp"),
  icon: document.querySelector("img.icon-temp"),
};

submitSearch.addEventListener("click", async () => {
  let place = await searchCity();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${place[0].lat}&lon=${place[0].lon}&units=metric&appid=2af05a035ace3fa63f8f71eebeeab844`
    );
    if (!response.ok) throw new Error("problema nella richiesta");
    const responseData = await response.json();
    console.log(responseData);
    weatherBox.city.textContent = place[0].name;
    weatherBox.country.textContent = place[0].state;
    weatherBox.temp.textContent = `${Math.trunc(responseData.main.temp)}°`;
    chooseIconForWeather(responseData);
  } catch (error) {
    console.log(error);
  }
});

const searchCity = async () => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${searchBox.value}&limit=1&appid=2af05a035ace3fa63f8f71eebeeab844`
    );
    if (!response.ok) {
      throw new Error("Richiesta andata male...");
    }
    const responseGeoData = await response.json();
    return responseGeoData;
  } catch (error) {
    console.log("errore!");
  }
};

const chooseIconForWeather = (data) => {
  switch (data.weather[0].main) {
    case "Clouds":
      srcIcon("clouds.svg");
      break;
    case "Rain":
      srcIcon("rain.svg");
      break;
    case "Clear":
      srcIcon("sun.svg");
  }
};

const srcIcon = (img) => {
  weatherBox.icon.src = `./assets/img/${img}`;
};
