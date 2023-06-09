import { BookRepository } from '@apps/inventory/repositories/book.repository';
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
}
