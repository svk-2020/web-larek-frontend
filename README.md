# Проектная работа "Веб-ларек"
<a id="anchor"></a>
***

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
***
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
### Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении
Товар и список товаров
```
export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
}
export interface IProductsList {
	products: IProduct[];
	getProduct(id: string): IProduct | undefined;
}
```
Товарная корзина
```
export interface IBasketList {
    shipments: IProduct[];
    addShipment(item: IProduct): void;
    deleteShipment(id: string): void;
    checkProduct(id: string): boolean;
    getQuantity(): number;
    getTotal(): number;
    getIds(): string[];
    clearBasket(): void;
}
```
Заказ
```
export interface IOrder {
    payment: TFormPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderInfo extends IOrder {
    orderInfo: IOrder;
}

// Паттерн Builder, для поэтапного составления заказа
export interface IOrderBuilder {
    infoShipments: TInfoShipments;
    infoDelivery: TInfoDelivery;
    infoContacts: TInfoContacts;
    getOrder(): IOrder;
}

export interface IOrderConstructor {
    new (): IOrderInfo;
}

// Завершение заказа
export interface ISuccess {
    orderSuccess: TSuccess;
}
```
Типы классов слоя данных и слоя представления
```
export type TInfoShipments = Pick<IOrder, 'total' | 'items'>;
export type TInfoDelivery = Pick<IOrder, 'payment' | 'address'>;
export type TInfoContacts = Pick<IOrder, 'email' | 'phone' >
export type TProductsPage = Omit<IProduct, 'description'>;
export type TCategory = 'card__category_soft' |
	'card__category_other' |
	'card__category_additional' |
	'card__category_button' |
	'card__category_hard';
export type TCategoryClasses = Record<string, TCategory>;
export type TCardBasket = Pick<IProduct, 'id' | 'title' | 'price'> & {index: number};
export type TCardDetail = IProduct & {priceCheck: boolean; state: boolean};

export type TPage = {counter: number, catalog: HTMLElement[]};
export type TBasket = {cardsList: HTMLElement[]; total: number; emptyCheck: boolean};
export type TModal ={content: HTMLElement};
export type TForm = {valid: boolean}
export type TFormPayment = 'card' | 'cash';
export type TFormOrder = {payment: TFormPayment; address: string};
export type TFormContacts = {email: string; phone: string};

export type TSuccess = {id: string; total: number};
export type TOrderSuccess = {description: string};
export type TId = {id: string};
```

## Описание проекта
***
Проект "Веб-ларек" реализует пример функционально упрощенного сервиса для покупок
товаров - интернет-магазина.\
В магазине представлены товары для веб-разработчиков.\
Пользователь может посмотреть каталог товаров, детальную информацию о товаре, 
добавить товар в корзину и сделать заказ.\
Проект реализован на TypeScript и представляет собой SPA (Single Page Application)
с использованием API для получения данных о товарах.

## Архитектура приложения
***
Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter):
* __Model__ - слой данных, отвечает за хранение и изменение данных
* __View__ - слой представления, отвечает за отображение данных на странице,
* __Presenter__ - презентер, отвечает за связь представления и данных.

### Базовый код
***


#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый 
адрес сервера и опциональный объект с заголовками запросов.

Поля:
* `readonly baseUrl: string` - базовый url для api
* `protected options: RequestInit` - объект с настройками для формирования запроса

Конструктор принимает параметры базового url для api и объект с настройками для формирования запроса

Методы:
* `protected handleResponse(response: Response): Promise<object>` - обрабатывает ответа с сервера. Если ответ с сервера пришел, то возвращается его в формате json, в противном случае формирует ошибку
* `get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
* `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.


#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Поля:
* `_events: Map<EventName, Set<Subscriber>>` - хранит события в виде Map, где ключом является строка или регулярное выражение, а значением сет коллбэков

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
* `on<T extends object>(event: EventName, callback: (data: T) => void): void` - Установить обработчик на событие
* `emit<T extends object>(event: string, data?: T): void` - Инициировать событие с данными
* `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие


### Слой данных
***

#### Класс Base
Абстрактный класс, является базовым родительским классом для классов слоя данных.

Поля:
- `protected events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Конструктор класса принимает инстант брокера событий


#### Класс Products
Расширяет класс Base. Класс отвечает за хранение и логику работы с данными товаров.\

Данные:
- `protected _products: IProduct[]` - список всех товаров в ларьке 

Конструктор класса принимает инстант брокера событий

Методы:
- `getProduct(id: string): IProduct` - возвращает товар по его id
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса


#### Класс Basket
Расширяет класс Base. Класс отвечает за хранение и логику работы с корзиной заказа.\

Данные:
- `protected _shipments: IProduct[]` - список товаров добавленных в корзину

Конструктор класса принимает инстант брокера событий

Методы:
- `addShipment(item: IProduct): void` - добавляет товар в корзину
- `deleteShipment(id: string): void` - удаляет товар из корзины
- `checkProduct(id: string): boolean` - проверяет наличие товара в корзине
- `get shipments(): IProduct[]` - получение списка товаров в корзине
- `getQuantity(): number` - возвращает количество товаров в корзине
- `getTotal(): number` - возвращает суммарную стоимость товаров в корзине
- `clearBasket(): void` - очищает данные заказа после оформления
- `getIds(): string` - возвращает список id товаров  


#### Класс Order
Расширяет класс Base. Класс отвечает за оформление заказа.\

Данные:
- `protected _payment: TFormPayment` - способ оплаты
- `protected _email: string` - email заказчика
- `protected _phone: string` - номер телефона заказчика
- `protected _address: string` - адрес заказчика
- `protected _total: number` - суммарная стоимость товаров в заказе
- `protected _items: string[]` - список id товаров заказа

Конструктор класса принимает инстант брокера событий

Методы:
- `get orderInfo(): IOrder` - возвращает информацию о заказе, для отправки в теле post запроса на сервер.
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс OrderBuilder
Расширяет класс Base. Реализует паттерн Builder для поэтапного создания экземпляра класса Order. \
Данные:
- `protected order: IOrderInfo` - экземпляр интерфейса

Конструктор класса принимает инстант брокера событий и:
- `orderConstructor: IOrderConstructor` - класс, создающий объекты интерфейса IOrder

Методы:
- `set infoShipments(info: TInfoShipments)` - добавляет в заказ информацию из корзины
- `set infoDelivery(info: TInfoDelivery)` - добавляет в заказ информацию из формы Order (адрес доставки)
- `set infoContacts(info: TInfoContacts)` - добавляет в заказ информацию из формы Contacts
- `getOrder(): IOrderInfo` - возвращает результат

#### Класс OrderSuccess
Расширяет класс Base. Обрабатывает данные с сервера после успешного оформления заказа. \
Данные:
- `protected _orderSuccess: TSuccess` - данные заказа с сервера

Конструктор класса принимает инстант брокера событий

Методы:
- сеттер и геттер для сохранения и получения данных из полей класса


### Слой представления
***

#### Класс BaseView
Абстрактный класс, является базовым родительским классом для классов слоя представления.

Поля:
- `protected _container` - DOM элемент компонента
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Конструктор принимает DOM элемент компонента и экземпляр класса `EventEmitter`

Методы:
- render(): HTMLElement - возвращает html-элемент по переданным данным


#### Класс CardView
Абстрактный класс, в который вынесены общие поля всех разновидностей карточек
имеющихся в приложении:
- CardCatalog, карточка в каталоге на главной странице;
- CardDetail, карточка с детальным описанием товара в модальном окне;
- CardBasket, карточка товара в корзине

Поля:
- `protected _id` - id карточки товара
- `protected _title` - html-элемент, отвечающий за отображение имени товара
- `protected _price` - html элемент, отвечающий за отображение цены товара

Конструктор принимает параметры базового класса BaseView
 
Методы:
- сеттеры и геттеры для сохранения и получения данных из полей класса


#### Класс CardCatalogView
Расширяет класс CardView. Служит для отображения карточки в каталоге на главной странице.

Поля:
- `protected _category` - html-элемент, отвечающий за отображение категории товара
- `protected _image` - html-элемент, отвечающий за отображение изображения товара

Конструктор принимает параметры базового класса CardView

Методы:
- `protected addCardCategory(value: string)` - в зависимости от названия, добавляет соответствующий класс карточке товара 
- сеттеры и геттеры для сохранения и получения данных из полей класса


#### Класс CardDetailView
Расширяет класс CardCatalogView. Служит для отображения карточки с детальным описанием товара в модальном окне.

Поля:
- `protected _description` - html-элемент, отвечающий за отображение описания товара
- `buttonOrder` - кнопка для добавления товара в заказ (или удаления из заказа)

Конструктор принимает параметры базового класса CardDetailView

Методы:
- `set description(value: string)` - устанавливает описание товара
- `set checkPrice(value: boolean)` - устанавливает флаг для блокировки кнопки добавления товара в корзину (в зависимости от стоимости товара) 
- `get checkPrice(): boolean` - возвращает состояние флага блокировки
- `set stateButton(value: boolean)` - устанавливает состояние кнопки добавления товара в заказ. В случе если у товара нет цены - он не продается.


#### Класс CardBasketView
Расширяет класс CardView. Служит для отображения карточки товара в корзине.

Поля:
- `index` - html-элемент, отвечающий за отображение порядкового номера в корзине
- `buttonDelete` - кнопка для удаления товара из заказа (иконка корзины)

Конструктор принимает параметры базового класса CardView

Методы:
- сеттеры и геттеры для сохранения и получения данных из полей класса


#### Класс PageView
Расширяет класс BaseView. Служит для отображения главной страницы приложения. \
Блоки главной страницы:
- каталог с карточками товаров
- корзина в шапке сайта

Поля:
- `protected _catalog` - контейнер для отображения карточек товаров
- `protected buttonBasket` - кнопка в виде корзины, открывающая модальное окно с заказом
- `protected _counter` - html-элемент, показывает количество товаров в заказе
- `protected screen` - html-элемент - содержимое экрана

Конструктор принимает параметры базового класса BaseView

Методы:
- `set catalog(cards: HTMLElement[])` - сеттер записывающий карточки в каталог
- `set counter(value: string)` - сеттер, записывает количество товаров в заказе
- `lockScreen(value: boolean): void` - блокировка/разблокировка экрана при открытии модального окна

#### Класс ModalView
Расширяет класс BaseView. Реализует модальное окно. 
Устанавливает слушатели на клик в оверлей и кнопку-крестик для закрытия модального окна.   

Поля:
- `protected _content` - html-элемент, содержимое модального окна
- `protected buttonClose` - кнопка закрытия модального окна

Конструктор принимает параметры базового класса BaseView

Методы:
- `set content(value: HTMLElement): void` - сеттер устанавливающий содержимое модального окна
- `open(): void` - метод для открытия модального окна
- `close(): void` - метод для закрытия модального окна

#### Класс BasketView
Расширяет класс BaseView. Служит для отображения корзины с товарами. 

Поля:
- `protected _orderList` - html-элемент, список товаров в заказе
- `protected _total` - html-элемент, общая стоимость товаров
- `protected buttonCheckout` - кнопка "Оформить" (заказ)

Конструктор принимает параметры базового класса BaseView

Методы:
- `set cardsList(cards: HTMLElement[])` - сеттер записывающий список товаров в заказ
- `set emptyCheck(state: boolean)` - сеттер устанавливающий состояние кнопки оформления заказа
- `set total(value: number)` - сеттер устанавливающий общую стоимость товаров

#### Класс FormView
Абстрактный класс, в который вынесены общие поля и методы всех разновидностей форм
имеющихся в приложении:
- FormDelivery, форма для заполнения метода оплаты и адреса доставки;
- FormContacts, форма для заполнения Email и номера телефона

Поля:
- `protected _form: HTMLFormElement` - html-элемент формы
- `protected inputs: HTMLInputElement[]` - список input элементов формы
- `protected submitButton: HTMLButtonElement` - кнопка подтверждения
- `protected errorMessage: HTMLSpanElement` - html-элемент для вывода сообщений об ошибках

Конструктор принимает параметры базового класса BaseView

Методы:
- `set valid(isValid: boolean): void` - изменяет активность кнопки подтверждения
- `get valid(): boolean` - получение статуса валидности
- `set errorMessage(value: string)` - установка текста сообщения об ошибке
- `clear(): void` - очистка формы


#### Класс FormOrderView
Расширяет класс FormView. 
Реализует форму для заполнения метода оплаты и адреса доставки

Поля:
- `protected buttonCard: HTMLButtonElement` - кнопка оплаты онлайн
- `protected buttonCash: HTMLButtonElement` - кнопка оплаты при получении
- `protected inputAddress: HTMLInputElement` - поле ввода адреса заказчика

Конструктор принимает параметры базового класса FormView

Методы:
- `protected getButtonActive(): HTMLButtonElement | null` - возвращает активную кнопку
- `protected resetButtons(): void` - снимает активность с кнопок выбора формы оплаты
- `clear()` - очистка формы
- `get payment(): TFormPayment` - возвращает название активной кнопки
- `get address(): string` - возвращает адрес заказчика
- `get valid(): boolean` - возвращает валидность формы
- `set valid(value: boolean)` - устанавливает блокировку кнопки Submit


#### Класс FormContactsView
Расширяет класс FormView. 
Реализует форму для заполнения контактных данных.

Поля:
- `protected inputEmail: HTMLInputElement` - поле ввода Email заказчика
- `protected inputPhone: HTMLInputElement` - поле ввода номера телефона заказчика

Конструктор принимает параметры базового класса FormView

Методы:
- `get email(): string` - возвращает Email заказчика
- `get phone(): string` - возвращает номер телефона заказчика
- `get valid(): boolean` - возвращает валидность формы
- `set valid(value: boolean)` - устанавливает блокировку кнопки Submit


#### Класс OrderSuccessView
Расширяет класс BaseView. 
Реализует уведомление об окончании оформления заказа

Поля:
- `protected _description` - html-элемент, выводит сумму списанных средств
- `protected buttonOrderSuccess: HTMLButtonElement` - кнопка "За новыми покупками"

Конструктор принимает параметры базового класса BaseView

Методы:
- `set description(total: string): void` - устанавливает сумму списанных средств


### Слой коммуникации
***

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

Поля:
- `protected cdn: string` - html-элемент, выводит сумму списанных средств

Параметры в конструкторе:
- параметры `Api`
- `cdn: string` - базовый путь до изображений карточек.


## Взаимодействие компонентов
***
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.


### *Список всех событий, которые могут генерироваться в системе:*

#### *События изменения данных (генерируются классами моделями данных)*
- `products:change` - изменение списка товаров (загрузка списка с сервера)
- `shipments:change` - изменение списка заказа (добавление и удаление товаров в заказ)
- `success:change` - окончание оформления заказа

#### *События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `modal-detail:open` - открытие модального окна c детальной информацией о товаре
- `modal-basket:open` - открытие модального окна c корзиной заказа

- `shipments:add` - добавление товара в заказ
- `shipments:delete` - удаление товара из заказа

- `form:open` - открытие модального окна с формой
- `order:input` - действия заказчика с полями формы Order
- `order:submit` - успешная отправка формы Order
- `contacts:input` - действия заказчика с полями формы Contacts
- `contacts:submit` - успешная отправка формы Contacts
- `success:confirm` - получение уведомления об успешном оформлении заказа



### Ссылка на репозитарий:
https://github.com/svk-2020/web-larek-frontend.git



### Автор проекта:

[Станислав Казаринов](mailto:skazarinov@mail.ru "Написать автору")

[__В начало__](#anchor) :point_up: