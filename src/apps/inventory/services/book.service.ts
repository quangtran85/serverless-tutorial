import { Errors } from '@apps/inventory/configs/errors';
import { BookRepository } from '@apps/inventory/repositories/book.repository';
import { AppException } from '@shared/libs/exception';
import {
  BookStatus,
  GetResourcesInput,
  ResourceDataOutput,
  ResourceOuput,
  ResourcesPaginateOuput,
} from '@shared/type';
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
  status: string;
};

export type BookGetListInput = GetResourcesInput & {
  title?: string;
  status?: BookStatus;
};

export type BookGetListOutput = ResourcesPaginateOuput<BookOutput>;

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
        status: entity.status,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  }

  async getDetail(id: string): Promise<ResourceDataOutput<BookOutput>> {
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
        status: result.status,
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

    return await this.getDetail(id);
  }

  async getList(data: BookGetListInput): Promise<BookGetListOutput> {
    let filterStatus = BookStatus.ACTIVE;
    if (data?.status) {
      filterStatus = data.status;
    }
    const result = await this.bookRepository.findAndCount(
      { status: filterStatus },
      { ...data },
    );

    return {
      data: result?.data.map(
        (item) =>
          ({
            id: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            stock: item.stock,
            reorderThreshold: item.reorderThreshold,
            stopOrder: item.stopOrder,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          } as BookOutput),
      ),
      pagination: result.pagination,
    };
  }
}
