import './scss/styles.scss';
import { Api } from "./components/base/Api";
import { BasketData } from "./components/models/BasketData";
import { CardsData } from "./components/models/CardsData";
import { OrderData } from "./components/models/OrderData";
import { API_URL } from "./utils/constants";
import { ApiCommunication } from "./components/communication/ApiCommunication";
import { EventEmitter } from './components/base/Events';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { BasketCardView, CatalogCardView, PreviewCardView, TButtonState } from './components/view/CardView';
import { ICard, TBasketItem, TCatalogItem, TOrderApi } from './types';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/view/Modal';
import { BasketView } from './components/view/BasketView';
import { ContactsForm, OrderForm } from './components/view/FormView';
import { OrderSuccess } from './components/view/OrderSuccess';

const events = new EventEmitter();

const cardsModel = new CardsData(events);
const basketModel = new BasketData(events);
const orderModel = new OrderData(events);

const api = new Api(API_URL);
const apiCommunication = new ApiCommunication(api);

apiCommunication.getProducts().then(data => {
    cardsModel.catalog = data.items;
})
.catch(error => {
    console.log('Возника ошибка при загрузке каталога: ', error);
});

const header = new Header(events, document.querySelector('.header') as HTMLElement)
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const modal = new Modal(events, document.querySelector('.modal') as HTMLElement);

events.on('catalog:changed', (data: ICard[]) => {
    const catalogArray: HTMLElement[] = [];
    data.forEach((card) => {
        const cardContainer = cloneTemplate(document.querySelector('#card-catalog') as HTMLTemplateElement);
        const catalogCardView = new CatalogCardView(cardContainer, {
            onClick: () => events.emit('preview:open', card)
        })
        const catalogCard = catalogCardView.render(card as TCatalogItem);
        catalogArray.push(catalogCard);
    })
    gallery.render({
        catalog: catalogArray
    })
})

events.on('preview:open', (card: ICard) => {
    const previewContainer = cloneTemplate(document.querySelector('#card-preview') as HTMLTemplateElement);

    const previewElement = new PreviewCardView(previewContainer, {
        onClick: () => {
            events.emit('card:change', card);
            events.emit('modal:close');
        }
    });

    let buyButton: TButtonState = 'add';
    if(card.price === null) {
        buyButton = 'off';
    } else if(basketModel.isInBasket(card.id) === true) {
        buyButton = 'delete';
    }

    modal.modalContent = previewElement.render({
            ...card,
            buttonState: buyButton
        });
});

events.on('card:change', (card: ICard) => {
    if(basketModel.isInBasket(card.id) === true) {
        basketModel.removefromBasket(card);
    } else {
        basketModel.addToBasket(card);
    }

    events.emit('basket:changed');
})

events.on('modal:close', () => {
    modal.close();
})

events.on('basket:changed', () => {
    header.render({
        counter: basketModel.getBasketTotalItems()
    });

})

events.on('basket:open', () => {
    const basketElement = cloneTemplate(document.querySelector('#basket') as HTMLTemplateElement);
    const basket = new BasketView(events, basketElement);
    const basketContent: HTMLElement[] = [];
    let i = 1;

    if(basketModel.getBasketTotalItems() === 0) {
        basketContent.push(document.createElement('span'));
        basketContent[0].textContent = 'Корзина пуста';
        basketContent[0].style.opacity = '30%';
    } else {
        basketModel.basket.forEach((item) => {
        const itemContainer = cloneTemplate(document.querySelector('#card-basket') as HTMLTemplateElement);
        const basketCardView = new BasketCardView(itemContainer, {
            onClick: () => {
                events.emit('card:change', item);
                events.emit('modal:close');
                events.emit('basket:open');
            }
        })
        const basketCard = basketCardView.render({
            ...item as TBasketItem,
            index: i
        });
        basketContent.push(basketCard); 
        i++;
    })
    }
    
    modal.modalContent = basket.render({
        price: basketModel.getBasketTotalPrice(),
        orderButtonState: (basketModel.getBasketTotalPrice() !== 0),
        basket: basketContent
    })
})

const formOrderElement = cloneTemplate(document.querySelector('#order') as HTMLTemplateElement);
const formOrder = new OrderForm(events, formOrderElement);
const formContactsElement = cloneTemplate(document.querySelector('#contacts') as HTMLTemplateElement);
const formContacts = new ContactsForm(events, formContactsElement);
const successElement = cloneTemplate(document.querySelector('#success') as HTMLTemplateElement);
const orderSuccess = new OrderSuccess(events, successElement);

events.on('basket:order', () => {
    modal.close();

    modal.modalContent = formOrder.render({
        errors: '',
        submitButtonState: false,
        buttonsState: undefined
    })
})

events.on('form:cardChosen', () => {
    let currentOrder = orderModel.order;
    currentOrder.payment = 'card';
    orderModel.order = currentOrder;

    events.emit('order:changed');
})

events.on('form:cashChosen', () => {
    let currentOrder = orderModel.order;
    currentOrder.payment = 'cash';
    orderModel.order = currentOrder;

    events.emit('order:changed');
})

events.on('order:submit', () => {
    modal.close();

    modal.modalContent = formContacts.render({
        errors: '',
        submitButtonState: false
    })
})

events.on('order:changed', () => {
    let currentOrder = orderModel.order;
    currentOrder.address = formOrder.getAddress();
    orderModel.order = currentOrder;

    const errorsMessage: string = orderModel.validatePayment() + orderModel.validateAddress();

    const activeElement = document.activeElement as HTMLInputElement;

    modal.modalContent = formOrder.render({
        errors: errorsMessage,
        submitButtonState: (errorsMessage === ''),
        buttonsState: orderModel.order.payment
    })

    activeElement.focus();
})

events.on('contacts:changed', () => {
    let currentOrder = orderModel.order;
    currentOrder.email = formContacts.getEmail();
    currentOrder.phone = formContacts.getPhone();
    orderModel.order = currentOrder;

    const errorsMessage: string = orderModel.validateEmail() + orderModel.validatePhone();

    const activeElement = document.activeElement as HTMLInputElement;

    modal.modalContent = formContacts.render({
        errors: errorsMessage,
        submitButtonState: (errorsMessage === '')
    })

    activeElement.focus();
})

events.on('contacts:submit', () => {
    const orderApi: TOrderApi = {
        ...orderModel.order,
        total: basketModel.getBasketTotalPrice(),
        items: basketModel.basket.map(item => item.id)
    }; 
    apiCommunication.setOrder(orderApi);

    modal.close();
    formOrder.clear();
    formContacts.clear();
    
    modal.modalContent = orderSuccess.render({
        totalPrice: basketModel.getBasketTotalPrice()
    });

    basketModel.clearBasket();
    orderModel.clearData();
})






