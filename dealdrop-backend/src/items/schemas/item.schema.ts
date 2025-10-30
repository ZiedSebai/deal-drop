import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true }) title: string;
  @Prop() description: string;
  @Prop({ required: true }) price: number;
  @Prop() category: string;
  @Prop() location: string;
  @Prop([String]) images: string[];
  @Prop({ required: true }) sellerId: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);