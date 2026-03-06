import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reference_poi' })
export class ThaiReferencePoi {
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

  @Column({ type: 'double precision', nullable: true })
  altitude: number;

  @Column({ type: 'int', nullable: true })
  state: number;

  @Column({ type: 'text', nullable: true })
  detection_class: string;

  @Column({ type: 'timestamptz', nullable: true })
  create_at: Date;
}
