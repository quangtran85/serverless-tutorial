import { JsonController, Post, Body } from 'routing-controllers';
import { Service } from 'typedi';
import { CreateBookDto } from '@apps/book/dtos/create-book.dto';
import { BookService } from '@apps/book/services/book.service';

@Service()
@JsonController('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('')
  async create(@Body() data: CreateBookDto) {
    return this.bookService.createBook(data);
  }
}
