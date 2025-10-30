import { Document } from 'mongoose';
export type ItemDocument = Item & Document;
export declare class Item {
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    images: string[];
    sellerId: string;
}
export declare const ItemSchema: import("mongoose").Schema<Item, import("mongoose").Model<Item, any, any, any, Document<unknown, any, Item, any, {}> & Item & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Item, Document<unknown, {}, import("mongoose").FlatRecord<Item>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Item> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
