import { ICard, ICardActions, TBasketItem, TCatalogItem } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class CardView<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(cardTitle: string) {
        this.titleElement.textContent = cardTitle;
    }

    set price(cardPrice: number) {
        if(cardPrice === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${cardPrice} синапсов`;
        }
    }
}

export class CardFullView<T> extends CardView<T> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    }

    set category(cardCategory: string) {
        this.categoryElement.textContent = cardCategory;
        if(cardCategory in categoryMap) {
            const modificator = categoryMap[cardCategory as keyof typeof categoryMap];
            this.categoryElement.classList.add(modificator);
        }
    }

    set image(cardImage: string) {
        cardImage = cardImage.replace(/\.svg$/, '.png');
        super.setImage(this.imageElement, CDN_URL + cardImage);
    }
}

export class CatalogCardView extends CardFullView<TCatalogItem> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        if(actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }
}

export type TButtonState = 'add' | 'delete' | 'off';

export type PreviewCardData = ICard & {
    buttonState: TButtonState
}

export class PreviewCardView extends CardFullView<PreviewCardData> {
    protected addToBasketButton: HTMLButtonElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.addToBasketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);

        if(actions?.onClick) {
            this.addToBasketButton.addEventListener('click', actions.onClick);
        }
    }

    set description(text: string) {
        this.descriptionElement.textContent = text;
    }

    set buttonState(state: TButtonState) {
        if(state === 'add') {
            this.addToBasketButton.textContent = 'Купить';
        } else if(state === 'delete') {
            this.addToBasketButton.textContent = 'Удалить из корзины';
        } else if(state === 'off') {
            this.addToBasketButton.textContent = 'Недоступно';
            this.addToBasketButton.disabled = true;
        }
    }
}

export type BasketCardData = TBasketItem & {
    index: number
}

export class BasketCardView extends CardView<BasketCardData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if(actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = value.toString();
    }
}
