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
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
        items += getStoreItem(category, data[key]);
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

function getStoreItem(category, data) {
    let item = '';
    // Товар
    item += '<div class="store__item">';
    {
        // Название товара
        item += wrapH4('store__name', data.model);

        // Содержимое
        item += '<div class="store__item-content">';
        {
            // Картинка
            item += '<div class="store__img"><img src="' + data.img + '" alt=""></div>';

            // Тэги
            item += '<div class="store__tags">';
            {
                // Если товар телефоны, то выводим также цвет и память
                if (category === 'phones') {
                    item += wrapDiv('store__tag color', data.color);
                    item += wrapDiv('store__tag memory', data.memory);
                }
                // Если товар не аксессуар, то выводим страну
                if (category !== 'stuff') {
                    item += wrapDiv('store__tag country', data.country);
                }
                // Конец тэгов
            }
            item += '</div>'

            // Цена
            let price = formatPrice(data.price) + ' ₽';
            item += wrapDiv('store__price', price);

            let button = '<button class="order-btn" onClick="openModal();">Заказать</button>';
            item += wrapDiv('store__btn', button);
        }
        // Конец содержимого
        item += '</div>'
    }
    // Конец товара
    item += '</div>'
    return item;
}

function wrapDiv(style, content) {
    return `<div class="${style}">${content}</div>`
}

function wrapH4(style, content) {
    return `<h4 class="${style}">${content}</h4>`
}