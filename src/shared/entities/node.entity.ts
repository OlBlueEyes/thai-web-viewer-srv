import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'node' })
export class ThaiNode {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({
    type: 'geometry',
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geom: {
    type: string;
    coordinates: number[];
  };
}
