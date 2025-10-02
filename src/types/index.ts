export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | undefined;

export interface ICard {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
}

export interface IOrderForm {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

export interface ICardsData {
    catalog: ICard[];
    preview: ICard | null;

    // saveCatalog(catalog: ICard[]): void;
    // getCatalog(): ICard[];
    getCard(cardId: string): ICard | undefined;
    // savePreview(card: ICard): void;
    // getPreview(): ICard;
}

export interface IBasketData {
    basket: ICard[];
    
    addToBasket(card: ICard): void;
    removefromBasket(card: ICard): void;
    clearBasket(): void;
    getBasketTotalPrice(): number;
    getBasketTotalItems(): number;
    // getBasket(): ICard[];
    isInBasket(cardId: string): boolean;
}

export interface IOrderData {
    order: IOrderForm;

    clearData(): void;
    checkValidation(): boolean;
    validatePayment(): string;
    validateAddress(): string;
    validateEmail(): string;
    validatePhone(): string;
    // getOrderData(): IOrderForm;
    // setOrderData(data: IOrderForm): void;
}

export type TOrderApi = IOrderForm & {
    total: number,
    items: string[]
}

export type TCatalogApi = {
    total: number,
    items: ICard[]
}

export type TBasketItem = Pick<ICard, 'title' | 'price'>;

export type TCatalogItem = Pick<ICard, 'title' | 'category' | 'image' | 'price'>

export interface ICardActions {
    onClick: () => void;
}
