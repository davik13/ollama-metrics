import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  userId: string; // Identifiant de l'utilisateur qui a initié l'interaction

  @IsString()
  prompt: string; // Prompt de l'utilisateur pour l'interaction

  @IsString()
  response: string; // Réponse de l'IA à l'interaction

  @IsBoolean()
  @IsOptional()
  accepted?: boolean = false; // Indique si l'interaction a été acceptée ou non

  @IsInt()
  @IsOptional()
  responseLines?: number = 0; // Nombre de lignes dans la réponse

  @IsInt()
  @IsOptional()
  responseTimeMs?: number = 0; // Temps de réponse en millisecondes

  @IsInt()
  @IsOptional()
  tokensPrompt?: number; // Nombre de tokens dans le prompt

  @IsInt()
  @IsOptional()
  tokensResponse?: number; // Nombre de tokens dans la réponse

  @IsInt()
  @IsOptional()
  evalDuration?: number; // Durée d'évaluation en millisecondes

  @IsString()
  @IsOptional()
  modelUsed?: string; // Modèle utilisé pour l'interaction
}
