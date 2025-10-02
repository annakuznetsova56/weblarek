import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface BasketViewData {
    price: number,
    orderButtonState: boolean,
    basket: HTMLElement[]
}

export class BasketView extends Component<BasketViewData> {
    protected basketElement: HTMLElement;
    protected basketOrderButton: HTMLButtonElement;
    protected priceElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketOrderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

        this.basketOrderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        })
    }

    set price(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    set orderButtonState(state: boolean) {
        this.basketOrderButton.disabled = !state;

        if(!state) {
            //basketContent.push(document.createElement('span'));
        this.basketElement.textContent = 'Корзина пуста';
        this.basketElement.style.opacity = '30%';
        } else {
            this.basketElement.style.opacity = '100%';
        }
    }

    set basket(items: HTMLElement[]) {
        items.forEach((item) => {
            this.basketElement.append(item);
        })
    }

    clear(): void {
        this.basketElement.innerHTML = '';
    }
}