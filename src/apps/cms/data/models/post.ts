import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';
import { AuthorInfo } from './value-objects/author.vo';

@modelOptions({ schemaOptions: { collection: 'posts' } })
export class Post extends BaseModel<Post> {
  @prop({ required: true, limit: 100 })
  public title: string;

  @prop({ required: true, limit: 500 })
  public description: string;

  @prop({ required: true, type: AuthorInfo })
  public authors: AuthorInfo[];

  toEntity(post = new Post()): Post {
    post = this.toBaseEntity(post);
    post.title = this.title;
    post.description = this.description;
    post.authors = this.authors;
    return post;
  }
}

export const postDataModel = getModelForClass(Post);
