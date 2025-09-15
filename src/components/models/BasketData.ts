import { IBasketData, ICard } from "../../types";

export class BasketData implements IBasketData {
    protected _basket: ICard[];

    constructor() {
        this._basket = [];
    }

    get basket() {
        return this._basket;
    }

    addToBasket(card: ICard): void {
        this._basket.push(card);
    }

    removefromBasket(card: ICard): void {
        this._basket = this._basket.filter(item => item.id !== card.id);
    }

    clearBasket(): void {
        this._basket = [];
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