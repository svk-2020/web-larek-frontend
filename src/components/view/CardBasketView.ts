import { CardView } from "./CardView";
import { IEvents } from "../base/events";
import { TCardBasket, ICardBasket } from '../../types';
import { ensureElement } from "../../utils/utils";

// Служит для отображения карточки товара в корзине
export class CardBasketView extends CardView<TCardBasket> implements ICardBasket {
    protected _index: HTMLSpanElement;
    protected buttonDelete: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container);
        this.buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.buttonDelete.addEventListener(
			'click', () => this.events.emit('shipments:delete', {id: this.id})
		)
    }

    set index(value: number) {
        this._index.textContent = String(value)
    }
}