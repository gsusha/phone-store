// Переменная для запроса
let request = new XMLHttpRequest();
// Записываем айдишник, куда пихать айтемы
let store = document.getElementById('store');

// Инициализируем наши кнопочки
const phones = document.querySelector("#phones-filter");
const earphones = document.querySelector("#earphones-filter");
const tv = document.querySelector("#tv-filter");
const stuff = document.querySelector("#stuff-filter");

// Пихаем кнопки в массив
let arr = [phones, earphones, tv, stuff];

// При загрузки страницы по умолчанию подгружаем телефоны, кнопка активна
document.addEventListener("DOMContentLoaded", () => requestToJson('phones'));
phones.classList.add("active");

// Вызываем соответсвтующие запросы по клику на кнопку
phones.addEventListener("click", () => requestToJson('phones'));
earphones.addEventListener("click", () => requestToJson('earphones'));
tv.addEventListener("click", () => requestToJson('tv'));
stuff.addEventListener("click", () => requestToJson('stuff'));

//Функция отправки запроса и обработки данных
function requestToJson(category) {
    // Отправляем запрос, парсим
    request.open("GET", `../data/${category}.json`, false);
    request.overrideMimeType("application/json");
    request.send(null);

    let data = JSON.parse(request.responseText);

    // Начинаем перебирать жсон
    let items = "";
    for (let key in data) {
        let versions = data[key];
        items += '<div class="store__item">';
        // Название товара
        items += '<div class="store__name">' + key + '</div>';

        // Слайдер
        items += '<div class="swiper store__item-slider">';
        items += '<div class="swiper-wrapper">';

        for (let ver in versions) {
            items += '<div class="swiper-slide">';

            items += '<div class="store__img"><img src="' + versions[ver].img + '" alt=""></div>';
            if (category === 'phones') {
                items += '<div class="store__color">' + versions[ver].color + '</div>';
                items += '<div class="store__memory">' + versions[ver].memory + '</div>';
            }
            if (category !== 'stuff') {
                items += '<div class="store__country">' + versions[ver].country + '</div>';
            }
            items += '<div class="store__price">' + versions[ver].price + '</div>';
            items += '<div class="store__btn"><button class="order-btn" onClick="openModal();">Заказать</button></div>';

            items += '</div>'
        }

        items += '</div>'
        items += '<div class="swiper-pagination"></div>';
        items += '</div>'

        items += '</div>'
    }

    // Суём в нужное место в HTML
    store.innerHTML = items;

    // Добавляем класс active элементу, на который кликнули, остальные классы active убираем
    arr.forEach((element) => {
        element.addEventListener("click", () => {
            element.classList.add("active");

            arr.filter((item) => item !== element)
                .forEach((item) => item.classList.remove("active"));
        });
    });
}

let swiper = new Swiper('store__item-slider', {
    // Optional parameters
    loop: true,

    // If we need pagination
    pagination: {
        el: 'swiper-pagination',
    },
});