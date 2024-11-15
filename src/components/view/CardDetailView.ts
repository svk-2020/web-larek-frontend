import { CardCatalogView } from "./CardCatalogView";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { TCardDetail, ICardDetail } from "../../types";

// Служит для отображения карточки с детальным описанием товара в модальном окне
export class CardDetailView extends CardCatalogView<TCardDetail> implements ICardDetail {
    protected _description: HTMLParagraphElement;
    protected buttonOrder: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._description = ensureElement<HTMLParagraphElement>('.card__text', container);
        this.buttonOrder = ensureElement<HTMLButtonElement>('.card__button', container);
        this.buttonOrder.addEventListener('click', () => {
            if(this.buttonOrder.textContent === 'Купить') {
                this.events.emit('shipments:add', {id: this.id})
            }
            else {
                this.events.emit('shipments:delete', {id: this.id})
            }
        })
    }

    set description(value: string) {
        this._description.textContent = value
    }

    set checkPrice(value: boolean) {
        this.buttonOrder.disabled = !value
    }

    get checkPrice() {
        return !this.buttonOrder.disabled
    }

    set stateButton(value: boolean) {
        if(!this.checkPrice) { this.buttonOrder.textContent = "Не продается"}
        else {
            if(value) {this.buttonOrder.textContent = "Убрать из корзины"}
            else {this.buttonOrder.textContent  = "Купить"}
        }
    }
}