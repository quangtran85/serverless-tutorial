import {
  BookCreateDto,
  BookGetListDto,
  BookUpdateDto,
} from '@apps/inventory/dtos/book';
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
  QueryParams,
} from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/')
  @Authorized(UserRole.MANAGER)
  async create(@Body() data: BookCreateDto) {
    return await this.bookService.createGet(data);
  }

  @Get('/')
  async getList(@QueryParams() data: BookGetListDto) {
    return await this.bookService.getList(data);
  }

  @Get('/:id')
  async getDetail(@Param('id') id: string) {
    return await this.bookService.getDetail(id);
  }

  @Put('/:id')
  @Authorized(UserRole.MANAGER)
  async update(@Param('id') id: string, @Body() data: BookUpdateDto) {
    return await this.bookService.update(id, data);
  }
}
