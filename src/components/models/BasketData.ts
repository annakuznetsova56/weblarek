import { IBasketData, ICard } from "../../types";
import { IEvents } from "../base/Events";

export class BasketData implements IBasketData {
    protected _basket: ICard[];

    constructor(protected events: IEvents) {
        this._basket = [];
    }

    get basket() {
        return this._basket;
    }

    addToBasket(card: ICard): void {
        this._basket.push(card);
        this.events.emit('basket:changed');
    }

    removefromBasket(card: ICard): void {
        this._basket = this._basket.filter(item => item.id !== card.id);
        this.events.emit('basket:changed');
    }

    clearBasket(): void {
        this._basket = [];
        this.events.emit('basket:changed');
    }

    getBasketTotalPrice(): number {
        return this._basket.reduce((sum, item) => sum + Number(item.price), 0)
    }

    getBasketTotalItems(): number {
        return this._basket.length;
    }

    isInBasket(cardId: string): boolean {
        return this._basket.some(item => item.id === cardId);
    }
}