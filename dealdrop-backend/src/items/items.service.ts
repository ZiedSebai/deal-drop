import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  create(data: any, userId: string) {
    return this.itemModel.create({ ...data, sellerId: userId });
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async findAll(filters: FindAllFilters = {}) {
    const { category, location, minPrice, maxPrice, search, page = 1, limit = 2 } = filters;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (location && location.trim()) {
      const escapedLocation = this.escapeRegex(location.trim());
      if (escapedLocation.length > 0) {
        try {
          query.location = { $regex: escapedLocation, $options: 'i' };
        } catch (err) {
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

  findOne(id: string) {
    return this.itemModel.findById(id);
  }
}