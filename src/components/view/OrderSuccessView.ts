import { BaseView } from "./BaseView";
import { TOrderSuccess, IOrderSuccess } from '../../types';
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";


// Реализует уведомление об окончании оформления заказа
export class OrderSuccessView extends BaseView<TOrderSuccess> implements IOrderSuccess {
    protected buttonOrderSuccess: HTMLButtonElement;
    protected _description: HTMLParagraphElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.buttonOrderSuccess = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._description = ensureElement<HTMLParagraphElement>('.order-success__description', container);
        this.buttonOrderSuccess.addEventListener('click', () => this.events.emit('success:confirm'))
    }

    set description(total: string) {
        this._description.textContent = `Списано ${total} синапсов`
    }
}