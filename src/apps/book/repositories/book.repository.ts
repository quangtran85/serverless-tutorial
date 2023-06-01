import { Service } from 'typedi';
import { Book, bookDataModel } from '@apps/book/models/book';
import { BaseRepository } from '@shared/data/mongodb/base.repository';

@Service()
export class BookRepository extends BaseRepository<Book> {
  constructor() {
    super(bookDataModel);
  }
}
