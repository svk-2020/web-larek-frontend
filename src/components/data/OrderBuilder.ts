import { Base } from "./Base";
import { IEvents } from "../base/events";
import { IOrderBuilder, IOrderConstructor,
	IOrderInfo, TInfoShipments, TInfoDelivery, TInfoContacts } from "../../types";

// Реализует паттерн Builder для поэтапного создания экземпляра класса Order
export class OrderBuilder extends Base implements IOrderBuilder {
  protected order: IOrderInfo;

  constructor(events: IEvents, orderConstructor: IOrderConstructor) {
	  super(events);
      this.order = new orderConstructor();
  }

  set infoShipments(info: TInfoShipments) {
    this.order.total = info.total;
    this.order.items = info.items
  }

  set infoDelivery(info: TInfoDelivery) {
    this.order.payment = info.payment;
    this.order.address = info.address
  }

  set infoContacts(info: TInfoContacts) {
    this.order.email = info.email;
    this.order.phone = info.phone;
  }

  getOrder() {
    return this.order
  }
}