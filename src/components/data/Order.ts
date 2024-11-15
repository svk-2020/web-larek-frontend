import { IOrder, TFormPayment } from '../../types';

// Класс отвечает за хранение и логику работы с данными заказа.
export class Order implements IOrder {
    protected _payment: TFormPayment;
    protected _email: string;
    protected _phone: string;
    protected _address: string;
    protected _total: number;
	protected _items: string[];

	// eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    set total(value: number) {
        this._total = value
    }

    set email(value: string) {
        this._email = value
    }

    set phone(value: string) {
        this._phone = value
    }

    set address(value: string) {
        this._address = value
    }

    set payment(value: TFormPayment) {
        this._payment = value
    }

    set items(value: string[]) {
        this._items = value
    }

    get orderInfo() {
        return {
			total: this._total,
			email: this._email,
			phone: this._phone,
			address: this._address,
			payment: this._payment,
			items: this._items
        }
    }
}