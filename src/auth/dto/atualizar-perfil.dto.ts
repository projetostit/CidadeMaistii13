import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class AtualizarPerfilDto {
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  email!: string;

  @Length(8, 8)
  cep!: string;

  @IsNotEmpty()
  complemento!: string;

  @IsOptional()
  @IsString()
  senhaAtual?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  novaSenha?: string;
}