import { Base } from './Base';
import { IBasketList, IProduct } from '../../types';
import { IEvents } from '../base/events';


// Класс отвечает за хранение и логику работы с данными заказа.
export class Basket extends Base implements IBasketList {
	protected _shipments: IProduct[];

    constructor(events: IEvents) {
        super(events);
        this._shipments = [];
    }

    addShipment(item: IProduct) {
        if(!this._shipments.find(product => {product.id === item.id})) {
			this._shipments.push(item);
            this.events.emit('shipments:change', {id: item.id })
        }
	}

    deleteShipment(id: string) {
		this._shipments = this._shipments.filter(product => product.id !== id);
		this.events.emit('shipments:change', {id})
	}

	checkProduct(id: string) {
		return Boolean(this._shipments.find(products => products.id === id))
	}

	get shipments() {
        return this._shipments
    }

    getQuantity(){
		return this._shipments.length
	}

    getTotal() {
        return this._shipments.reduce((sum, products) => {
            return sum + products.price
        }, 0)
	}

	getIds() {
        return this._shipments.map(product => {
            return product.id
        })
    }

    clearBasket() {
		this._shipments = [];
		this.events.emit('shipments:change', {})
	}
}