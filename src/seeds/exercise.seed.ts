import { exercises } from '../seed-data';
import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Exercise } from '../entity/exercise.entity';

export default class SeedExercises implements Seeder {
    public async run(factory: Factory, dataSource: DataSource): Promise<void> {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(Exercise)
          .values(exercises)
          .execute()
      }
};