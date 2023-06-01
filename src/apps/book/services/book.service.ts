import { Service } from 'typedi';
import { BookRepository } from '../repositories/book.repository';
import { Errors } from '@apps/book/configs/errors';
import { AppException } from '@shared/libs/exception';
import { ResourceDataOutput, ResourceOutput } from '@shared/type';

export type BookOutput = ResourceOutput & {
  id: any;
  price: number;
  title: string;
  authorName: string;
  stock?: number;
  stopOrder?: boolean;
  reorderThreshold?: number;
};

export type CreateBookInput = {
  price: number;
  title: string;
  authorName: string;
  numberInStock?: number;
  stopOrder?: boolean;
  reorderThreshold?: number;
};

@Service()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async createBook(
    data: CreateBookInput,
  ): Promise<ResourceDataOutput<BookOutput>> {
    const existBook = await this.bookRepository.findOne({
      title: data.title,
      authorName: data.authorName,
    });
    if (existBook) {
      const { errorCode, message, httpCode } = Errors.ERROR_BOOK_EXISTS;
      throw new AppException(errorCode, message, httpCode);
    }
    const entity = await this.bookRepository.createGet(data);

    return {
      data: {
        id: entity.id,
        title: entity.title,
        authorName: entity.authorName,
        price: entity.price,
        stock: entity.numberInStock,
        stopOrder: entity.stopOrder,
        reorderThreshold: entity.reorderThreshold,
      },
    };
  }
}
