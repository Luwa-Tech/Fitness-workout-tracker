import { categories } from '../seed-data';
import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Category } from '../entity/category.entity';

export default class SeedCategories implements Seeder {
    public async run(factory: Factory, dataSource: DataSource): Promise<void> {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values(categories)
          .execute()
      }
};

//Try importing the ormconfig file, initialize it and use it here
// instead of using import from typeorm

// factory: Factory, dataSource: DataSource