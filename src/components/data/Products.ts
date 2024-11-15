import { Base } from './Base';
import { IProduct, IProductsList } from "../../types";
import { IEvents } from '../base/events';


// Класс отвечает за хранение и логику работы с данными товаров.
export class Products extends Base implements IProductsList {
    protected _products: IProduct[];

    constructor(events: IEvents) {
        super(events);
        this._products = [];
    }

    set products(value: IProduct[]) {
	    this._products = value;
        this.events.emit('products:change', this._products)
	}

    get products() {
        return this._products;
    }

    getProduct(id: string) {
        return this._products.find((product) => {
            return (product.id === id)
        })
    }
}