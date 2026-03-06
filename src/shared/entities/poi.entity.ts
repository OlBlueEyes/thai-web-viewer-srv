import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'poi' })
export class ThaiPoi {
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

  @Column({ type: 'int', nullable: true })
  bbox_x: number;

  @Column({ type: 'int', nullable: true })
  bbox_y: number;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'bigint', nullable: true })
  reference_poi_id: string;

  @Column({ type: 'bigint', nullable: true })
  frame_id: string;
}
