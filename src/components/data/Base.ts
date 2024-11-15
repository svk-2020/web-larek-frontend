import { IEvents } from '../base/events';


// Базовый родительский класс для классов слоя данных.
export abstract class Base {
	protected events: IEvents;

	protected constructor(events: IEvents) {
		this.events = events;
	}
}