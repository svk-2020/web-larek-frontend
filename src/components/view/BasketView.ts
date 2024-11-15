import { BaseView } from "./BaseView";
import { TBasket } from '../../types';
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

// Служит для отображения корзины с товарами.
export class BasketView extends BaseView<TBasket> {
    protected _orderList: HTMLUListElement;
    protected _totalPrice: HTMLSpanElement;
    protected buttonPlaceOrder : HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._orderList = ensureElement<HTMLUListElement>('.basket__list', container);
        this._totalPrice = ensureElement<HTMLSpanElement>('.basket__price', container);
        this.buttonPlaceOrder = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.buttonPlaceOrder.addEventListener('click', () => this.events.emit('form:open'))
    }

    set cardsList(cards: HTMLElement[]) {
        this._orderList.replaceChildren(...cards)
    }

    set emptyCheck(state: boolean) {
        this.buttonPlaceOrder.disabled = state;
    }

    set total(value: number) {
        this._totalPrice.textContent = String(value) + ' синапсов';
    }
}