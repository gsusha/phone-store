// Переменная для запроса
let request = new XMLHttpRequest();
// Записываем айдишник, куда пихать айтемы
let store = document.getElementById('store');

// Инициализируем наши кнопки
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

// Функция получения эмодзи страны
function getEmoji(country) {
    switch (country) {
        case "Россия":
            return '🇷🇺';
        case "США":
            return '🇺🇸';
        case "Япония":
            return '🇯🇵';
        case "Кувейт":
            return '🇰🇼';
        case "Индия":
            return '🇮🇳';
        case "Европа":
            return '🇪🇺';
        case "Гонконг":
            return '🇭🇰';
        case "Иордания":
            return '🇯🇴';
        case "Саудовская Аравия":
            return '🇵🇸';
        case "ОАЭ":
            return '🇦🇪';
        case "Китай":
            return '🇨🇳';
        default:
            return '';
    }
}

// Функция вывода цены по разрядам
function priceWithSpaces(price) {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Функция отправки запроса и обработки данных
function requestToJson(category) {
    // Отправляем запрос, парсим
    request.open("GET", `../data/${category}.json`, false);
    request.overrideMimeType("application/json");
    request.send(null);

    let data = JSON.parse(request.responseText);

    // Начинаем перебирать жсон
    let items = "";
    for (let key in data) {

        // Товар
        items += '<div class="store__item">';
        // Название товара
        items += '<div class="store__name">' + data[key].model + '</div>';

        // Содержимое
        items += '<div class="store__item-content">';

        // Картинка
        items += '<div class="store__img"><img src="' + data[key].img + '" alt=""></div>';

        // Тэги
        items += '<div class="store__tags">';
        // Если товар телефоны, то выводим также цвет и память
        if (category === 'phones') {
            items += '<div class="store__tag color">' + data[key].color + '</div>';
            items += '<div class="store__tag memory">' + data[key].memory + ' ГБ</div>';
        }
        // Если товар не аксессуар, то выводим страну
        if (category !== 'stuff') {
            items += '<div class="store__tag country">' + getEmoji(data[key].country) + '</div>';
        }
        // Конец тэгов
        items += '</div>'

        // Цена
        items += '<div class="store__price">' + priceWithSpaces(data[key].price) + ' ₽</div>';

        items += '<div class="store__btn"><button class="order-btn" onClick="openModal();">Заказать</button></div>';

        // Конец содержимого
        items += '</div>'

        // Конец товара
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