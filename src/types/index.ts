// Интерфейсы и типы данных
export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
}

export interface IOrder {
    email: string;
    phone: string;
    address: string;
	payment: TPayment;
	products: IProduct[];
	total: number | null;
}

export interface IProductsData {
	products: TProductsPage[];
	detail: string | null;
}

// вспомогательные типы
export type TPayment = 'card' | 'cash';

// производные типы
export type TProductsPage = Omit<IProduct, 'description'>;
export type TProductsOrder = Pick<IProduct, 'title' | 'price'>;
export type TOrderPaymentAddress = Pick<IOrder, 'payment' | 'address'>;
export type TOrderEmailPhone = Pick<IOrder, 'email' | 'phone'>;
export type TOrderCheckout = Pick<IOrder, 'total'>;