import { JsonController, Param, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { PostService } from '@cms/services/post.service';

@Service()
@JsonController('/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  async getAll() {
    return this.postService.find();
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return this.postService.get(id);
  }
}
