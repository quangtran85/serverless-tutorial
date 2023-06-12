import { BookCreateDto, BookUpdateDto } from '@apps/inventory/dtos/book';
import { BookService } from '@apps/inventory/services/book.service';
import { UserRole } from '@shared/type';
import {
  Authorized,
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/create')
  @Authorized(UserRole.MANAGER)
  async create(@Body() data: BookCreateDto) {
    return await this.bookService.createGet(data);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return await this.bookService.get(id);
  }

  @Put('/update/:id')
  @Authorized(UserRole.MANAGER)
  async update(@Param('id') id: string, @Body() data: BookUpdateDto) {
    return await this.bookService.update(id, data);
  }
}
