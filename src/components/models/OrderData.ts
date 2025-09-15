import { IOrderData, IOrderForm } from "../../types";

export class OrderData implements IOrderData {
    protected _order: IOrderForm;

    constructor() {
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
    }

    clearData(): void {
        this._order.address = '';
        this._order.email = '';
        this._order.payment = undefined;
        this._order.phone = '';
    }

    checkValidation(): boolean {
        return this.validatePayment() && this.validateAddress() && this.validateEmail() && this.validatePhone();
    }

    validatePayment(): boolean {
        return (this._order.payment === 'card' || this._order.payment === 'cash');
    }

    validateAddress(): boolean {
        return (this._order.address !== '');
    }

    validateEmail(): boolean {
        return (this._order.email !== '');
    }

    validatePhone(): boolean {
        return (this._order.phone !== '');
    }
}