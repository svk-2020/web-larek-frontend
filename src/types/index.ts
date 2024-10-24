// Интерфейсы и типы данных
export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
}

export interface IProductsData {
	products: TProductsPage[];
	getProduct(id: string): IProduct | undefined;
}

export interface IOrderInfo {
    email: string;
    phone: string;
    address: string;
	payment: TPayment;
}

export interface IOrderData {
	products: TProductsOrder[];
	total: number | null;
	addProduct(item: TProductsOrder): void;
	checkProduct(id: string): boolean;
	deleteProduct(id: string): void;
	getQuantity(): number;
	getTotal(): number;
}

export interface IOrder extends IOrderInfo, IOrderData {
	clearOrder(): void;
}

// вспомогательные типы
export type TPayment = 'online' | 'receipt';

// производные типы
export type TProductsPage = Omit<IProduct, 'description'>;
export type TProductsOrder = Pick<IProduct, 'id' |'title' | 'price'>;
export type TOrderPaymentAddress = Pick<IOrderInfo, 'payment' | 'address'>;
export type TOrderEmailPhone = Pick<IOrderInfo, 'email' | 'phone'>;
export type TOrderCheckout = Pick<IOrder, 'total'>;