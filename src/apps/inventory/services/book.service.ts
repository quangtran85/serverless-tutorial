import { Errors } from '@apps/inventory/configs/errors';
import { BookRepository } from '@apps/inventory/repositories/book.repository';
import { AppException } from '@shared/libs/exception';
import { ResourceDataOutput, ResourceOuput } from '@shared/type';
import { Service } from 'typedi';

export type CreateBookInput = {
  title: string;
  author: string;
  price: number;
  stock: number;
  reorderThreshold: number;
  stopOrder?: boolean;
};

export type BookOutput = ResourceOuput & {
  title: string;
  author: string;
  price: number;
  stock: number;
  reorderThreshold: number;
  stopOrder?: boolean;
};

@Service()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async createGet(
    data: CreateBookInput,
  ): Promise<ResourceDataOutput<BookOutput>> {
    const entity = await this.bookRepository.createGet(data);
    return {
      data: {
        id: entity.id,
        title: entity.title,
        author: entity.author,
        price: entity.price,
        stock: entity.stock,
        reorderThreshold: entity.reorderThreshold,
        stopOrder: entity.stopOrder,
      },
    };
  }

  async get(id: string): Promise<ResourceDataOutput<BookOutput>> {
    const result = await this.bookRepository.get(id);
    if (!result) {
      const { errorCode, message, httpCode } = Errors.BOOK_NOT_FOUND;
      throw new AppException(errorCode, message, httpCode);
    }

    return {
      data: {
        id: result.id,
        title: result.title,
        author: result.author,
        price: result.price,
        stock: result.stock,
        reorderThreshold: result.reorderThreshold,
        stopOrder: result.stopOrder,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }
}
