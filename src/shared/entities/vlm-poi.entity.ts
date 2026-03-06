import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vlm_poi' })
export class ThaiVlmPoi {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'boolean', nullable: true })
  is_veg_encroachment: boolean;

  @Column({ type: 'text', nullable: true })
  desc_veg_encroachment: string;

  @Column({ type: 'jsonb', nullable: true })
  bbox_veg_encroachment: { x1: number; y1: number; x2: number; y2: number };

  @Column({ type: 'boolean', nullable: true })
  is_soil_subsidence: boolean;

  @Column({ type: 'text', nullable: true })
  desc_soil_subsidence: string;

  @Column({ type: 'jsonb', nullable: true })
  bbox_soil_subsidence: { x1: number; y1: number; x2: number; y2: number };

  @Column({ type: 'boolean', nullable: true })
  is_guardrail_damage: boolean;

  @Column({ type: 'text', nullable: true })
  desc_guardrail_damage: string;

  @Column({ type: 'jsonb', nullable: true })
  bbox_guardrail_damage: { x1: number; y1: number; x2: number; y2: number };

  @Column({ type: 'boolean', nullable: true })
  is_lane_damage: boolean;

  @Column({ type: 'text', nullable: true })
  desc_lane_damage: string;

  @Column({ type: 'jsonb', nullable: true })
  bbox_lane_damage: { x1: number; y1: number; x2: number; y2: number };

  @Column({ type: 'boolean', nullable: true })
  is_sign_damage: boolean;

  @Column({ type: 'text', nullable: true })
  desc_sign_damage: string;

  @Column({ type: 'jsonb', nullable: true })
  bbox_sign_damage: { x1: number; y1: number; x2: number; y2: number };

  @Column({ type: 'bigint', nullable: true })
  vlm_frame_id: string;
}
