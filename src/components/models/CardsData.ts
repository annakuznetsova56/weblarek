import { ICardsData, ICard } from "../../types";
import { IEvents } from "../base/Events";
// import { IEvents } from "../base/events";

export class CardsData implements ICardsData {
    protected _catalog: ICard[];
    protected _preview: ICard | null;

    constructor(protected events: IEvents) {
       this._catalog = [];
       this._preview = null;
    }

    set catalog(catalog: ICard[]) {
        this._catalog = catalog;
        this.events.emit('catalog:changed', catalog);
    }

    get catalog(): ICard[] {
        return this._catalog;
    }

    getCard(cardId: string): ICard | undefined {
        return this._catalog.find(card => card.id === cardId);
    }

    set preview(card: ICard) {
        this._preview = card;
        this.events.emit('preview:changed');
    }

    get preview(): ICard | null {
        return this._preview;
    } 
}