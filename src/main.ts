// import './scss/styles.css';
import { Api } from "./components/base/Api";
import { BasketData } from "./components/models/BasketData";
import { CardsData } from "./components/models/CardsData";
import { OrderData } from "./components/models/OrderData";
import { API_URL } from "./utils/constants";
import { apiProducts } from './utils/data';
import { ApiCommunication } from "./components/communication/ApiCommunication";

const cardsModel = new CardsData();
const basketModel = new BasketData();
const orderModel = new OrderData();

cardsModel.catalog = apiProducts.items;
console.log('Каталог: ', cardsModel.catalog);
const someCard = cardsModel.getCard(apiProducts.items[2].id);
const otherCard = cardsModel.getCard(apiProducts.items[1].id);
const oneMoreCard = cardsModel.getCard(apiProducts.items[3].id);
if(someCard) {
    cardsModel.preview = someCard;
}



if(someCard && otherCard && oneMoreCard) {
    basketModel.addToBasket(someCard);
    basketModel.addToBasket(otherCard);
    basketModel.addToBasket(oneMoreCard);
    // basketModel.removefromBasket(someCard);
    // basketModel.clearBasket();
}

console.log('Корзина: ', basketModel.basket);
console.log('Товаров в корзине: ', basketModel.getBasketTotalItems());
console.log('Общая стоимость: ', basketModel.getBasketTotalPrice());
console.log("проверка на наличие в корзине: ", basketModel.isInBasket('12345678'));

console.log("Валидация заказа: ", orderModel.checkValidation());

orderModel.order = {
    address: 'Here',
    email: 'a@yandex.ru',
    payment: 'card',
    phone: '123456789'
}

console.log("Данные заказа: ", orderModel.order)
console.log("Валидация заказа: ", orderModel.checkValidation());

const api = new Api(API_URL);
const apiCommunication = new ApiCommunication(api);

apiCommunication.getProducts().then(data => {
    cardsModel.catalog = data.items;
    console.log('Каталог: ', cardsModel.catalog);
})
.catch(error => {
    console.log('Возника ошибка при загрузке каталога: ', error);
});