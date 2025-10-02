import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ModalData {
    modalContent: HTMLElement
}

export class Modal extends Component<ModalData> {
    protected closeButton: HTMLButtonElement;
    protected modalContainer: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContainer = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        })

        this.container.addEventListener('click', (evt: MouseEvent) => {
        if (evt.target === this.container) {
            this.events.emit('modal:close');
        }
    });
    }

    set modalContent(content: HTMLElement) {
        this.modalContainer.append(content);
        document.body.style.overflow = 'hidden';

        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.modalContainer.innerHTML = '';

        document.body.style.overflow = '';
    }
}