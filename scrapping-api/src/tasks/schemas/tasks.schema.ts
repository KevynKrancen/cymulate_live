import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'
import { Schema as MongooseSchema } from 'mongoose';
enum TaskStatus {
  CREATED = 'created',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}


export type TaskDocument = Task & Document;



@Schema()
export class Task {
  @Prop({ type: String, required: true })
  urlToScrape: string;

  @Prop({ type: String, required: true })
  from: string;

  @Prop({ type: Date, required: true, default: () => Date.now() })
  createdDate: Date;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.CREATED })
  status: TaskStatus;

  @Prop({ type: String, required: false })
  token: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.pre('save', function(next) {
  if (this.isNew && !this.token) {
    this.token = `${this.from}${this._id}`;
  }
  next();
});