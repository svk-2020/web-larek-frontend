import { Api, ApiListResponse } from "./base/api";
import { IAppApi, IOrder, IProduct, TSuccess } from '../types';

/* Расширяет класс Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса. */
export class AppApi extends Api implements IAppApi {
    protected cdn: string;

    constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((list: ApiListResponse<IProduct>) => {
            return list.items.map((item) => {
			    return {...item, image: this.cdn + item.image}
		    })
        })
    }

    getProductById(id: string): Promise<IProduct> {
        return this.get('/product/' + id).then((product: IProduct) => {
            return {...product, image: this.cdn + product.image}
        })
    }

    postOrder(order: IOrder): Promise<TSuccess> {
        return this.post('/order', order).then((success: TSuccess) => {
            return success
        })
    }
}