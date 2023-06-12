import {
  JsonController,
  Post,
  Body,
  Put,
  Param,
  Authorized,
} from 'routing-controllers';
import { Service } from 'typedi';
import { CreateBookDto } from '@apps/book/dtos/create-book.dto';
import { UpdateBookDto } from '@apps/book/dtos/update-book.dto';
import { BookService } from '@apps/book/services/book.service';
import { UserRole } from '@shared/type';

@Service()
@JsonController('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('')
  @Authorized(UserRole.MANAGER)
  async create(@Body() data: CreateBookDto) {
    return await this.bookService.createBook(data);
  }

  @Put('/:id')
  @Authorized(UserRole.MANAGER)
  async update(@Body() data: UpdateBookDto, @Param('id') id: string) {
    return await this.bookService.updateBook(id, data);
  }
}
