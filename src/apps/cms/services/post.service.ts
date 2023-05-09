import { Service } from 'typedi';

@Service()
export class PostService {
  async find(): Promise<any[]> {
    return [];
  }

  async get(id: number): Promise<any> {
    return { id };
  }
}
