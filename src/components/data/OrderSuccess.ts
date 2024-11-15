import { Base } from "./Base";
import { IEvents } from "../base/events";
import { ISuccess, TSuccess } from '../../types';

// Обрабатывает данные с сервера после успешного оформления заказа.
export class OrderSuccess extends Base implements ISuccess {
  protected _orderSuccess: TSuccess;

  constructor(events: IEvents) {
    super(events)
  }

  set orderSuccess (value: TSuccess) {
    this._orderSuccess = value;
    this.events.emit('success:change', this._orderSuccess)
  }

  get orderSuccess() {
    return this._orderSuccess;
  }
}