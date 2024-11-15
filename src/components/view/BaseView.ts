import { IEvents } from "../base/events";


// Базовый родительский класс для классов слоя представления.
export abstract class BaseView<T> {
    protected container: HTMLElement;
    protected events: IEvents;

	protected constructor(container: HTMLElement, events: IEvents) {
	    this.container = container;
	    this.events = events;
	}

	render(data?: Partial<T>): HTMLElement {
	    Object.assign(this, data ?? {});
	    return this.container;
	}
}