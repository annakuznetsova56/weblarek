import { IOrderData, IOrderForm } from "../../types";
import { IEvents } from "../base/Events";

export class OrderData implements IOrderData {
    protected _order: IOrderForm;

    constructor(protected events: IEvents) {
        this._order = {
        address: '',
        email: '',
        payment: undefined,
        phone: ''
        };
    }

    get order(): IOrderForm {
        return this._order;
    }

    set order(data: IOrderForm) {
        this._order = data;
        this.events.emit('orderdata:changed');
    }

    clearData(): void {
        this._order.address = '';
        this._order.email = '';
        this._order.payment = undefined;
        this._order.phone = '';
        this.events.emit('orderData:changed');
    }

    checkValidation(): boolean {
        const validationMessage = this.validatePayment() + this.validateAddress() + this.validateEmail() + this.validatePhone();
        if(validationMessage === '') {
            return true;
        } else {
            console.log(validationMessage);
            return false;
        }
    }

    validatePayment(): string {
        if(this._order.payment === 'card' || this._order.payment === 'cash') {
            return '';
        } else {
            return 'Не выбран способ оплаты. ';
        }
    }

    validateAddress(): string {
        if(this._order.address !== '') {
            return '';
        } else {
            return 'Не введен адрес. ';
        }
    }

    validateEmail(): string {
        if(this._order.email !== '') {
            return '';
        } else {
            return 'Не введен email. ';
        }
    }

    validatePhone(): string {
        if(this._order.phone !== '') {
            return '';
        } else {
            return 'Не введен телефон. ';
        }
    }
}