import { Item, ItemDocument } from './schemas/item.schema';
import { Model } from 'mongoose';
interface FindAllFilters {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class ItemsService {
    private itemModel;
    constructor(itemModel: Model<ItemDocument>);
    create(data: any, userId: string): Promise<import("mongoose").Document<unknown, {}, ItemDocument, {}, {}> & Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    private escapeRegex;
    findAll(filters?: FindAllFilters): Promise<{
        items: (import("mongoose").Document<unknown, {}, ItemDocument, {}, {}> & Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, ItemDocument, {}, {}> & Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, ItemDocument, {}, {}> & Item & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ItemDocument, "findOne", {}>;
}
export {};
