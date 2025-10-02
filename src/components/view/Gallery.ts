import { Component } from "../base/Component";

interface GalleryData {
    catalog: HTMLElement[]
}

export class Gallery extends Component<GalleryData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.catalogElement = this.container;
    }

    set catalog(cards: HTMLElement[]) {
        cards.forEach((card) => {
            this.catalogElement.append(card);
        })
    }
}