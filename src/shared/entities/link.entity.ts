import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'link' })
export class ThaiLink {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({
    type: 'geometry',
    nullable: true,
    spatialFeatureType: 'LineString',
    srid: 4326,
  })
  geom: {
    type: string;
    coordinates: number[][];
  };

  @Column({ type: 'text', nullable: true })
  osm_id: string;

  @Column({ type: 'text', nullable: true })
  osm_type: string;

  @Column({ type: 'text', nullable: true })
  highway: string;

  @Column({ type: 'text', nullable: true })
  oneway: string;

  @Column({ type: 'text', nullable: true })
  layer: string;

  @Column({ type: 'text', nullable: true })
  name_ko: string;

  @Column({ type: 'text', nullable: true })
  name_en: string;

  @Column({ type: 'bigint', nullable: true })
  source: string;

  @Column({ type: 'bigint', nullable: true })
  target: string;
}
