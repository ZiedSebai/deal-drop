import { ItemsService } from './items.service';
export declare class ItemsController {
    private itemsService;
    constructor(itemsService: ItemsService);
    create(body: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/item.schema").ItemDocument, {}, {}> & import("./schemas/item.schema").Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(category?: string, location?: string, minPrice?: number, maxPrice?: number, search?: string, page?: number, limit?: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("./schemas/item.schema").ItemDocument, {}, {}> & import("./schemas/item.schema").Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    findOne(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/item.schema").ItemDocument, {}, {}> & import("./schemas/item.schema").Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, import("./schemas/item.schema").ItemDocument, {}, {}> & import("./schemas/item.schema").Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, import("./schemas/item.schema").ItemDocument, "findOne", {}>;
}
