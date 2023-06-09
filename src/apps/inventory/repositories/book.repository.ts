import { Book, bookDataModel } from '@apps/inventory/models/book';
import { BaseRepository } from '@shared/data/mongodb/base.repository';
import { Service } from 'typedi';

@Service()
export class BookRepository extends BaseRepository<Book> {
  constructor() {
    super(bookDataModel);
  }
}
