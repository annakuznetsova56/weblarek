import { IApi, TCatalogApi, TOrderApi } from "../../types";


export class ApiCommunication {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<TCatalogApi> {
        let catalogData: TCatalogApi = {
            total: 0,
            items: []
        };
        await this.api.get('/product/').then(data => {
            if (data && typeof data === 'object' &&
                'items' in data && 'total' in data &&
                Array.isArray(data.items) && typeof data.total === 'number') {
                    catalogData = data as TCatalogApi;
                }
        });
        console.log(catalogData);
        return catalogData;
    }

    setOrder(order: TOrderApi): void {
        this.api.post('/order/', order);
    }
}