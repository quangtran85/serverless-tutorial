import { BaseModel } from '@shared/data/mongodb';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'books' } })
export class Book extends BaseModel<Book> {
  @prop({ require: true, limit: 200 })
  public title: string;

  @prop({ required: true, limit: 200 })
  public author: string;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public stock: number;

  @prop({ required: true })
  public reorderThreshold: number;

  @prop({ required: false, default: false })
  public stopOrder: boolean;

  toEntity(book = new Book()): Book {
    book = this.toBaseEntity(book);
    book.title = this.title;
    book.author = this.author;
    book.price = this.price;
    book.stock = this.stock;
    book.reorderThreshold = this.reorderThreshold;
    book.stopOrder = this.stopOrder;
    return book;
  }
}

export const bookDataModel = getModelForClass(Book);
