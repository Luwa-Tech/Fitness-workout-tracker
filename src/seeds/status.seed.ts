import { statuses } from '../seed-data';
import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Status } from '../entity/status.entity';

export default class SeedStatuses implements Seeder {
    public async run(factory: Factory, dataSource: DataSource): Promise<void> {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(Status)
          .values(statuses)
          .execute()
      }
};