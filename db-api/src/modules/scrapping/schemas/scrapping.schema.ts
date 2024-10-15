import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ScrappedDataDocument = ScrappedData & Document;

@Schema({
  strict:false
})
export class ScrappedData {
  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({required: true })
  scrappedData: string[];
  
}

export const ScrappedDataSchema = SchemaFactory.createForClass(ScrappedData);
