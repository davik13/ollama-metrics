import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Interaction {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: string;
  
    @Column()
    prompt: string;
  
    @Column()
    response: string;
  
    @Column({ default: false })
    accepted: boolean;
  
    @Column({ default: 0 })
    responseLines: number;
  
    @Column({ default: 0 })
    responseTimeMs: number;
  
    @Column({ nullable: true })
    tokensPrompt: number;
  
    @Column({ nullable: true })
    tokensResponse: number;
  
    @Column({ nullable: true })
    evalDuration: number;
  
    @Column({ nullable: true })
    modelUsed: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }