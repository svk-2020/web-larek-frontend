import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppApi } from './components/AppApi';
import { IProduct, TId, TProductsPage, TSuccess } from './types';
// классы данных
import { Products } from './components/data/Products';
import { Basket } from './components/data/Basket';
import { Order } from './components/data/Order';
import { OrderBuilder } from './components/data/OrderBuilder';
import { OrderSuccess } from './components/data/OrderSuccess';
// классы представления
import { PageView } from './components/view/PageView';
import { CardCatalogView } from './components/view/CardCatalogView';
import { CardDetailView } from './components/view/CardDetailView';
import { CardBasketView } from './components/view/CardBasketView';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { FormOrderView } from './components/view/FormOrderView';
import { FormContactsView } from './components/view/FormContactsView';
import { OrderSuccessView } from './components/view/OrderSuccessView';


// Контейнеры и темплейты классов представления
const containerPage = ensureElement<HTMLElement>('.page');
const containerModal = ensureElement<HTMLDivElement>('#modal-container');
const templateCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardDetail = ensureElement<HTMLTemplateElement>('#card-preview');
const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templateOrder = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');
// Экземпляры сервисных классов EventEmitter и AppApi
const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();
// Экземпляры классов слоя данных
const dataProducts = new Products(events);
const dataBasket = new Basket(events);
const dataOrder = new OrderBuilder(events, Order);
const dataSuccess = new OrderSuccess(events);
// Экземпляры классов слоя представления
const viewPage = new PageView(containerPage, events);
const viewModal = new ModalView(containerModal, events);
const viewCardDetail = new CardDetailView(cloneTemplate(templateCardDetail), events);
const viewBasket = new BasketView(cloneTemplate(templateBasket), events);
const viewFormOrder = new FormOrderView(cloneTemplate(templateOrder), events);
const viewFormContacts = new FormContactsView(cloneTemplate(templateContacts), events);
const viewOrderSuccess = new OrderSuccessView(cloneTemplate(templateSuccess), events);

// Получение данных о продуктах с сервера
api.getProducts().then((data) => {
    dataProducts.products = data
}).catch(console.error)

// Обработка событий

// Вывод данных полученных с сервера на главную страницу
events.on('products:change', (products: IProduct[]) => {
    const cardsList = products.map((product) => {
        const card = new CardCatalogView<TProductsPage>(
            cloneTemplate(templateCardCatalog), events
        );
        return card.render(product)
    })
    viewPage.render({catalog: cardsList})
});

// Открытие модального окна
events.on('modal:open', () => {
    viewPage.lockScreen(true);
});

// Закрытие модального окна
events.on('modal:close', () => {
    viewPage.lockScreen(false);
});

// Отображение модального окна c детальной информацией о товаре
events.on('modal-detail:open',(data: TId) => {
    const productDetail = dataProducts.getProduct(data.id);
    if(productDetail) {
        viewModal.render({ content: viewCardDetail.render({
            ...productDetail,
            checkPrice: Boolean(productDetail.price),
            stateButton: dataBasket.checkProduct(productDetail.id),
        })});
        viewModal.open();
    }
});

// Добавление товара в заказ
events.on('shipments:add', (data: TId) => {
    dataBasket.addShipment(dataProducts.getProduct(data.id))
});

// Удаление товара из заказа
events.on('shipments:delete', (data: TId) => {
    dataBasket.deleteShipment(data.id)
});

// Изменение заказа, формирование корзины
events.on('shipments:change', (data: TId) => {
    viewCardDetail.render({
        checkPrice: true,
        stateButton: !dataBasket.checkProduct(data.id)
    });
    viewPage.render({counter: dataBasket.getQuantity()});
    const shipmentsList = dataBasket.shipments.map((shipment, index) => {
        const cardBasket = new CardBasketView(cloneTemplate(templateCardBasket), events);
        return cardBasket.render({...shipment, index: ++index})
    });
    viewBasket.render({
        cardsList: shipmentsList,
        total: dataBasket.getTotal(),
        emptyCheck: dataBasket.getQuantity() === 0
    })
});

// Открытие модального окна с содержимым корзины
events.on('modal-basket:open', () => {
    viewModal.render({ content: viewBasket.render({
        total: dataBasket.getTotal(),
        emptyCheck: dataBasket.getQuantity() === 0
    })});
    viewModal.open();
});

// Переход к заполнению формы: Order
events.on('form:open', () => {
    dataOrder.infoShipments = {
        total: dataBasket.getTotal(),
        items: dataBasket.getIds()
    };
    viewModal.render({
        content: viewFormOrder.render({valid: viewFormOrder.valid})
    })
    console.log(dataOrder);
});

// Заполнение полей формы: Order
events.on('order:input', () => {
    viewFormOrder.valid = viewFormOrder.valid;
    dataOrder.infoDelivery = {
        payment: viewFormOrder.payment,
        address: viewFormOrder.address
    }
    console.log(dataOrder);
});

// Переход к заполнению формы: Contacts
events.on('order:submit', () => {
    viewModal.render({
        content: viewFormContacts.render({valid: viewFormContacts.valid})
    })
    console.log(dataOrder);
});

// Заполнение полей формы: Contacts
events.on('contacts:input', () => {
    viewFormContacts.valid = viewFormContacts.valid;
    dataOrder.infoContacts = {
        email: viewFormContacts.email,
        phone: viewFormContacts.phone
    };
    console.log(dataOrder);
});

// Окончание заполнения форм, отправка данных на сервер
events.on('contacts:submit', () => {
    console.log(dataOrder);
    const order = dataOrder.getOrder().orderInfo;
    console.log(order);
    api.postOrder(order).then((data: TSuccess) => {
        dataSuccess.orderSuccess = data;
        viewFormOrder.clear();
        viewFormContacts.clear();
        dataBasket.clearBasket();
    }).catch(console.error)
});

// Получение данных с сервера после завершения оформления заказа
events.on('success:change', (data: TSuccess) => {
    viewModal.render({
        content: viewOrderSuccess.render({description: String(data.total)})
    })
});

// Успешная покупка
events.on('success:confirm', () => {
    viewModal.close();
})