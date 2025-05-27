import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn()
  id: number; // Identifiant unique de l'interaction

  @Column()
  userId: string; // Identifiant de l'utilisateur qui a initié l'interaction

  @Column()
  prompt: string; // Prompt de l'utilisateur pour l'interaction

  @Column()
  response: string; // Réponse de l'IA à l'interaction

  @Column({ default: false })
  accepted: boolean; // Indique si l'interaction a été acceptée ou non

  @Column({ default: 0 })
  responseLines: number; // Nombre de lignes dans la réponse

  @Column({ default: 0 })
  responseTimeMs: number; // Temps de réponse en millisecondes

  @Column({ nullable: true })
  tokensPrompt: number; // Nombre de tokens dans le prompt

  @Column({ nullable: true })
  tokensResponse: number; // Nombre de tokens dans la réponse

  @Column({ nullable: true })
  evalDuration: number; // Durée d'évaluation en millisecondes

  @Column({ nullable: true })
  modelUsed: string; // Modèle utilisé pour l'interaction

  @CreateDateColumn()
  createdAt: Date; // Date de création de l'interaction
}
