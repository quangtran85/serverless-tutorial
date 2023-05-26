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
import { PaginateType, UserRole } from '@shared/type';

@Service()
@JsonController('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/all')
  @Authorized(UserRole.MANAGER)
  async getAll(@QueryParams() params: PaginateType) {
    return this.bookService.getAll(params);
  }

  @Get('/:id')
  @Authorized(UserRole.MANAGER)
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
