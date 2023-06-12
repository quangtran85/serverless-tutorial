import { BookCreateDto } from '@apps/inventory/dtos/book/create.dto';
import { BookService } from '@apps/inventory/services/book.service';
import { UserRole } from '@shared/type';
import {
  Authorized,
  Body,
  Get,
  JsonController,
  Param,
  Post,
} from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/create')
  @Authorized(UserRole.MANAGER)
  async create(@Body() data: BookCreateDto) {
    return this.bookService.createGet(data);
  }

  @Get('/detail/:id')
  @Authorized([UserRole.MANAGER])
  async detail(@Param('id') id: string) {
    return this.bookService.get(id);
  }
}
