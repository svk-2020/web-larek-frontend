# Проектная работа "Веб-ларек"
<a id="anchor"></a>

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
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
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта
Проект "Веб-ларек" реализует пример функционально упрощенного сервиса для покупок
товаров - интернет-магазина.\
В магазине представлены товары для веб-разработчиков.\
Пользователь может посмотреть каталог товаров, детальную информацию о товаре, 
добавить товар в корзину и сделать заказ.\
Проект реализован на TypeScript и представляет собой SPA (Single Page Application)
с использованием API для получения данных о товарах.

Особенности реализации:


## Данные и типы данных, используемые в приложении

Товар (продукт)

```
export interface IProduct {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
}
```

Заказ

```
export interface IOrder {
    email: string;
    phone: string;
    address: string;
    payment: TPayment;
    products: IProduct[];
    total: number | null;
}
```

Интерфейс для каталога товаров выводимых на основную страницу 

```
export interface IProductsData {
    products: TProductCatalog[];
    detail: string | null;
}
```

Выбор формы оплаты 

```
export type TPayment = 'card' | 'cash';
```

Списки товаров выводимых на основную страницу и в составе заказа 

```
export type TProductsPage = Omit<IProduct, 'description'>;
export type TProductsOrder = Pick<IProduct, 'title' | 'price'>;
```

Данные заказа в форме на первом, втором и заключительном этапе

```
export type TOrderPaymentAddress = Pick<IOrder, 'payment' | 'address'>;
export type TOrderEmailPhone = Pick<IOrder, 'email' | 'phone'>;
export type TOrderCheckout = Pick<IOrder, 'total'>;
```

### Автор проекта:

[Казаринов С.В.](mailto:skazarinov@mail.ru "Написать автору")

[__В начало__](#anchor) :point_up: