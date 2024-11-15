import { CardView } from "./CardView";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { ICardCatalog, TCategoryClasses } from "../../types";


// Служит для отображения карточки в каталоге на главной странице.
export class CardCatalogView<T> extends CardView<T> implements ICardCatalog {
    protected _image: HTMLImageElement;
    protected _category: HTMLSpanElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLSpanElement>('.card__category', container);
        this.container.addEventListener(
            'click', () => this.events.emit('modal-detail:open', {id: this.id})
        )
    }

    protected addCardCategory(value: string) {
        const categoryCard: TCategoryClasses = {
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'хард-скил': 'card__category_hard',
            'другое': 'card__category_other',
            'софт-скил': 'card__category_soft'
	    }
		if(value in categoryCard) {
            this._category.classList.add(categoryCard[value])
        }
    }

    set image(src: string) {
        this._image.src = src;
        this._image.alt = this.title
    }

    set category(value: string) {
        this._category.textContent = value;
        this.addCardCategory(value)
    }

    get category() {
        return this._category.textContent ?? '';
    }
}