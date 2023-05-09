import {
  JsonController,
  Param,
  Get,
  Post,
  Body,
  QueryParams,
  Patch,
} from 'routing-controllers';
import { Service } from 'typedi';
import { CreateUserDto } from '@account/apis/dtos/user/create-user.dto';
import { GetUsersDto } from '@account/apis/dtos/user/get-users.dto';
import { UserService } from '@account/services/user.service';
import { UpdateUserDto } from '../dtos/user/update-user.dto';

@Service()
@JsonController('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@QueryParams() data: GetUsersDto) {
    return this.userService.getAll(data);
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.createGet(data);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }
}
