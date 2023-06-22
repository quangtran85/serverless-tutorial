import {
  JsonController,
  Get,
  Post,
  Param,
  QueryParams,
  Put,
  Body,
  Authorized,
} from 'routing-controllers';
import { Service } from 'typedi';
import { BookCreateDto } from '@apps/store/dtos/book/create.dto';
import { BookUpdateDto } from '@apps/store/dtos/book/update.dto';
import { BookService } from '@apps/store/services/book.service';
import { UserRole } from '@shared/type';
import { BookSearchDto } from '@apps/store/dtos/book/search.dto';

@Service()
@JsonController('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/all')
  async getAll(@QueryParams() params: BookSearchDto) {
    const { title, ...paginateParams } = params;
    return this.bookService.getBooks({ title }, paginateParams);
  }

  @Get('/all-in-stock')
  async getAllInStock(@QueryParams() params: BookSearchDto) {
    const { title, ...paginateParams } = params;
    return this.bookService.getBooks({ title }, paginateParams, true);
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.bookService.getById(id);
  }

  @Post('')
  @Authorized(UserRole.MANAGER)
  async create(@Body() data: BookCreateDto) {
    return this.bookService.createGet(data);
  }

  @Put('/:id')
  @Authorized(UserRole.MANAGER)
  put(@Param('id') id: string, @Body() data: BookUpdateDto) {
    return this.bookService.update(id, data);
  }
}
