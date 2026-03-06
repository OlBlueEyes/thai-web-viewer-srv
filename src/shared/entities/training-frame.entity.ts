import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'training_frame' })
export class ThaiTrainingFrame {
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

  @Column({ type: 'timestamptz', nullable: true })
  time: Date;

  @Column({ type: 'timestamptz', nullable: true })
  sensor_time: Date;

  @Column({ type: 'text', nullable: true })
  path: string;

  @Column({ type: 'text', nullable: true })
  equipment_serial: string;
}
