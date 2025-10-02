import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface OrderSuccessData {
    totalPrice: number
}

export class OrderSuccess extends Component<OrderSuccessData> {
    protected successButton: HTMLButtonElement;
    protected totalPriceElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.totalPriceElement = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.successButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        })
    }

    set totalPrice(price: number) {
        this.totalPriceElement.textContent = `Списано ${price} синапсов`;
    }
}