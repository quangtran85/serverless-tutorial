import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

@modelOptions({ schemaOptions: { collection: 'books' } })
export class Book extends BaseModel<Book> {
  @prop({ required: true, limit: 50 })
  public title: string;

  @prop({ required: true, limit: 50 })
  public author: string;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public stock: number;

  @prop({ required: false })
  public reOrderThreshold?: number;

  @prop({ required: false })
  public isStopOrder?: boolean;

  toEntity(book = new Book()): Book {
    book = this.toBaseEntity(book);
    book.title = this.title;
    book.author = this.author;
    book.price = this.price;
    book.stock = this.stock;
    book.reOrderThreshold = this.reOrderThreshold || 0;
    book.isStopOrder = this.isStopOrder || false;

    return book;
  }
}

export const bookDataModel = getModelForClass(Book);
