import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

@modelOptions({ schemaOptions: { collection: 'books' } })
export class Book extends BaseModel<Book> {
  @prop({ required: true })
  public price: number;

  @prop({ required: true, maxLength: 100 })
  public title: string;

  @prop({ required: true })
  public numberInStock: number;

  @prop({ required: true, maxLength: 100 })
  public authorName: string;

  @prop({ required: false, default: false })
  public stopOrder: boolean;

  @prop({ required: false, default: 0 })
  public reorderThreshold: number;

  toEntity(book = new Book()): Book {
    book = this.toBaseEntity(book);
    book.price = this.price;
    book.title = this.title;
    book.numberInStock = this.numberInStock;
    book.authorName = this.authorName;
    book.stopOrder = this.stopOrder;
    book.reorderThreshold = this.reorderThreshold;
    return book;
  }
}

export const bookDataModel = getModelForClass(Book);
