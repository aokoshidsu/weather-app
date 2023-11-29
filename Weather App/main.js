const APIKEY = 'c43217697f5b23dce329e5776aa9e6af';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const dayList = document.querySelector('.days-list');

const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lighting',
    '11n': 'cloud-lighting',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water',
};

function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${APIKEY}&units=metric&lang=ru`;

    fetch(apiUrl).then(response => response.json()).then(
        data =>{
            const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
            const todayWeather = data.list[0].weather[0].description;
            const todayWeatherIconCode = data.list[0].weather[0].icon;

            todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('ru', { weekday: 'long' });
            todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' });
            todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
            console.log(todayTemperature)
            console.log(typeof(todayTemperature))
            todayTemp.textContent = todayTemperature;
            
            //Апдейт локации и описания погоды в left-info
            const locationElement = document.querySelector('.today-info > div > span');
            locationElement.textContent = `${data.city.name}, ${data.city.country}`;

            const weatherDescriptionElement = document.querySelector('.today-weather > h3');
            weatherDescriptionElement.textContent = todayWeather;

            //Апдейт инфо в day-info
            const todayPrecipitation = `${data.list[0].main.pressure}`;
            const todayHumidity = `${data.list[0].main.humidity}%`;
            const todayWindSpeed = `${data.list[0].wind.speed} км/ч`;

            const dayInfoContainer = document.querySelector('.full-day-info');
            dayInfoContainer.innerHTML = `
                <div class="day-info">
                    <span class="title">ДАВЛЕНИЕ</span>
                    <span class="value">${todayPrecipitation}
                    </span>
                </div>
                <div class="day-info">
                    <span class="title">ВЛАЖНОСТЬ</span>
                    <span class="value">${todayHumidity}
                    </span>
                </div>
                <div class="day-info">
                    <span class="title">СКОРОСТЬ ВЕТРА</span>
                    <span class="value">${todayWindSpeed}
                    </span>
                </div>
            `;

            //Апдейт погоды следующих 4 дней
            const today = new Date();
            const nextDaysData = data.list.slice(1);

            const uniqueDays = new Set();
            let count = 0;
            dayList.innerHTML = '';
            for (const dayData of nextDaysData){
                const forecastDate = new Date(dayData.dt_txt);
                const dayAbbreviation = forecastDate.toLocaleDateString('ru', { weekday: 'short' });
                const dayTemp = `${Math.round(dayData.main.temp)}°C`;
                const iconCode = dayData.weather[0].icon;

                //Проверка на то, чтобы дни не потворялись 
                if(!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()){
                    uniqueDays.add(dayAbbreviation);
                    dayList.innerHTML += `
                        <li>
                            <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                            <span>${dayAbbreviation}</span>
                            <span class="day-temp">${dayTemp}</span>
                        </li>
                    `;
                    count++;
                } 

                //Остановка после получения 4 дней
                if (count === 4) break;
            }
        }).catch(error => {
            alert(`Error fetching weather data: ${error} (Api Error) `);
        });
}

//фетч погодных данных при загрузке документа на дефолтную локацию (Ижевск)
document.addEventListener('DOMContentLoaded', () =>{
    const defaultLocation = 'Izhevsk';
    fetchWeatherData(defaultLocation);
}); 

locButton.addEventListener('click', () => {
    const location = prompt('Введите местоположение : ');
    if (!location) return;
    fetchWeatherData(location);
})