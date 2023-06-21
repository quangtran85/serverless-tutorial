import { Errors } from '@apps/store/configs/errors';
import { AppException } from '@shared/libs/exception';
import { BookRepository } from '@apps/store/repositories/book.repository';
import {
  GetResourcesInput,
  ResourceOutput,
  ResourcesPaginateOutput,
  ResourceDataOutput,
} from '@shared/type';
import { Service } from 'typedi';
import { FilterQuery } from 'mongoose';
import { Book } from '@apps/store/models/book';

export type GetBooksInput = GetResourcesInput;
export type GetBooksOutput = ResourcesPaginateOutput<BookOutput>;
export type BookOutput = ResourceOutput & {
  title: string;
  author: string;
  price: number;
  stock: number;
  reOrderThreshold?: number;
  isStopOrder?: boolean;
};
export type CreateBookInput = {
  title: string;
  author: string;
  price: number;
  stock: number;
  reOrderThreshold?: number;
  isStopOrder?: boolean;
};
export type UpdateUserInput = {
  title: string;
  author: string;
  price: number;
  stock: number;
  reOrderThreshold?: number;
  isStopOrder?: boolean;
};

@Service()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getBooks(
    filter: FilterQuery<Book>,
    data: GetBooksInput,
  ): Promise<GetBooksOutput> {
    const {title, inStock} = filter;
    const defaultFilter: FilterQuery<Book> = {
      title: { $ne: null },
    };
    if (!title) {
      filter = defaultFilter;
    }
    if (inStock) {
      filter = {
        ...filter,
        stock: { $gt: 1 },
      };
    }
    const result = await this.bookRepository.findAndCount(filter, {
      ...data,
    });
    return {
      data: result?.data.map(
        (item) =>
          ({
            id: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            stock: item.stock,
            reOrderThreshold: item?.reOrderThreshold,
            isStopOrder: item?.isStopOrder,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
          } as BookOutput),
      ),
      pagination: result.pagination,
    };
  }

  async getById(id: string): Promise<ResourceDataOutput<BookOutput>> {
    const result = await this.bookRepository.get(id);
    if (!result) {
      const { errorCode, message, httpCode } = Errors.RESOURCE_NOT_FOUND;
      throw new AppException(errorCode, message, httpCode);
    }

    return {
      data: {
        id: result.id,
        title: result.title,
        author: result.author,
        price: result.price,
        stock: result.stock,
        reOrderThreshold: result.reOrderThreshold,
        isStopOrder: result.isStopOrder,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }

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
        reOrderThreshold: entity?.reOrderThreshold,
        isStopOrder: entity?.isStopOrder,
        createdAt: entity?.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  }

  async update(id: string, data: UpdateUserInput) {
    return await this.bookRepository.update(id, { ...data }, { new: true });
  }

  async findBooksByIds(bookIds: string[]): Promise<BookOutput[]> {
    const filter: FilterQuery<Book> = { _id: { $in: bookIds } };

    const books = await this.bookRepository.find(filter);

    return books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      reOrderThreshold: book.reOrderThreshold,
      isStopOrder: book.isStopOrder,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }));
  }

  async decreaseStock(book: BookOutput, quantity: number): Promise<boolean> {
    book.stock -= quantity;
    return await this.bookRepository.update(book.id, { stock: book.stock });
  }
}
