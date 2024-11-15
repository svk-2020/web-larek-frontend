// Интерфейсы и типы данных

// слой данных - товар
export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
}

// слой данных - список товаров
export interface IProductsList {
	products: IProduct[];
	getProduct(id: string): IProduct | undefined;
}

// слой данных - товарная корзина
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

// слой данных - заказ
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

// слой данных - паттерн Builder, для поэтапного составления заказа
export interface IOrderBuilder {
    infoShipments: TInfoShipments;
    infoDelivery: TInfoDelivery;
    infoContacts: TInfoContacts;
    getOrder(): IOrder;
}

export interface IOrderConstructor {
    new (): IOrderInfo;
}

// слой данных - завершение заказа
export interface ISuccess {
    orderSuccess: TSuccess;
}

// слой коммуникации - взаимодействие с бэкендом сервиса
export interface IAppApi {
    getProducts(): Promise<IProduct[]>;
    getProductById(id: string): Promise<IProduct>;
}

// слой представления - карточка товара
export interface ICard {
    id: string;
    title: string;
    price: string;
}

// слой представления - карточка товара в каталоге
export interface ICardCatalog {
    image: string;
    category: string;
}

// слой представления - карточка товара в корзине
export interface ICardBasket {
    index: number;
}

// слой представления - детальная карточка товара
export interface ICardDetail {
    description: string;
    checkPrice: boolean;
    stateButton: boolean;
}

// слой представления - основная страница
export interface IPage {
    catalog: HTMLElement[];
	counter: number;
    lockScreen(value: boolean): void;
}

// слой представления - модальное окно
export interface IModal {
    content: HTMLElement;
    open(): void;
    close(): void;
}

// слой представления - общий интерфейс форм
export interface IForm {
    valid: boolean;
    errorMessage: string;
    clear(): void;
}

// слой представления - форма Order
export interface IFormOrder {
    payment: TFormPayment | null;
    address: string;
    valid: boolean;
    clear(): void;
    render(data: object ): HTMLElement;
}

// слой представления - форма Contacts
export interface IFormContacts {
    email: string;
    phone: string;
    valid: boolean;
}

// слой представления - сообщение об успешном завершении оформления заказа
export interface IOrderSuccess {
    description: string;
}


// типы классов слоя данных и слоя представления
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
export type TCardDetail = IProduct & {checkPrice: boolean; stateButton: boolean};

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

