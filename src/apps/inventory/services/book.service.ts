import { Errors } from '@apps/inventory/configs/errors';
import { BookRepository } from '@apps/inventory/repositories/book.repository';
import { AppException } from '@shared/libs/exception';
import { ResourceDataOutput, ResourceOuput } from '@shared/type';
import { Service } from 'typedi';

export type BookCreateInput = {
  title: string;
  author: string;
  price: number;
  stock: number;
  reorderThreshold: number;
  stopOrder?: boolean;
};

export type BookUpdateInput = {
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
    data: BookCreateInput,
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
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
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

  async update(
    id: string,
    data: BookUpdateInput,
  ): Promise<ResourceDataOutput<BookOutput>> {
    const isUpdated = await this.bookRepository.updateById(id, { ...data });
    if (!isUpdated) {
      const { errorCode, message, httpCode } = Errors.INTERNAL_SERVER_ERROR;
      throw new AppException(errorCode, message, httpCode);
    }

    return await this.get(id);
  }
}
