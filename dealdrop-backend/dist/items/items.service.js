"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const item_schema_1 = require("./schemas/item.schema");
const mongoose_2 = require("mongoose");
let ItemsService = class ItemsService {
    itemModel;
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    create(data, userId) {
        return this.itemModel.create({ ...data, sellerId: userId });
    }
    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    async findAll(filters = {}) {
        const { category, location, minPrice, maxPrice, search, page = 1, limit = 2 } = filters;
        const query = {};
        if (category) {
            query.category = category;
        }
        if (location && location.trim()) {
            const escapedLocation = this.escapeRegex(location.trim());
            if (escapedLocation.length > 0) {
                try {
                    query.location = { $regex: escapedLocation, $options: 'i' };
                }
                catch (err) {
                    console.warn('Invalid regex for location:', escapedLocation);
                }
            }
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined) {
                query.price.$lte = Number(maxPrice);
            }
        }
        if (search && search.trim()) {
            const escapedSearch = this.escapeRegex(search.trim());
            if (escapedSearch.length > 0) {
                query.$or = [
                    { title: { $regex: escapedSearch, $options: 'i' } },
                    { description: { $regex: escapedSearch, $options: 'i' } },
                ];
            }
        }
        const skip = (page - 1) * limit;
        const totalItems = await this.itemModel.countDocuments(query);
        const items = await this.itemModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return {
            items,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                totalItems,
                itemsPerPage: limit,
            },
        };
    }
    findOne(id) {
        return this.itemModel.findById(id);
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(item_schema_1.Item.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ItemsService);
//# sourceMappingURL=items.service.js.map