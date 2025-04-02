import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  userId: string;

  @IsString()
  prompt: string;

  @IsString()
  response: string;

  @IsBoolean()
  @IsOptional()
  accepted?: boolean = false;

  @IsInt()
  @IsOptional()
  responseLines?: number = 0; // ✅ nom cohérent avec l'entité

  @IsInt()
  @IsOptional()
  responseTimeMs?: number = 0;

  @IsInt()
  @IsOptional()
  tokensPrompt?: number;

  @IsInt()
  @IsOptional()
  tokensResponse?: number;

  @IsInt()
  @IsOptional()
  evalDuration?: number;

  @IsString()
  @IsOptional()
  modelUsed?: string;
}
