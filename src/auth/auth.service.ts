import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as mysql from 'mysql2/promise';
import { RegisterDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';

@Injectable()
export class AuthService {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  constructor(private jwtService: JwtService) {}


  // BUSCAR CEP
  async buscarCep(cep: string) {
    const resposta = await fetch('https://viacep.com.br/ws/' + cep + '/json/');

    if (!resposta.ok) {
      throw new BadRequestException('CEP inválido');
    }

    const endereco: any = await resposta.json();

    if (endereco.erro) {
      throw new BadRequestException('CEP não encontrado');
    }

    return endereco;
  }

// REGISTRAR PROBLEMA
  async register(dados: RegisterDto) {
    const [lista] = await this.db.query(
      'SELECT id FROM cidadao WHERE email = ?',
      [dados.email],
    );

    if ((lista as any[]).length > 0) {
      throw new BadRequestException('Email já cadastrado');
    }

    const endereco = await this.buscarCep(dados.cep);

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const [resultado] = await this.db.query(
      'INSERT INTO cidadao (nome, email, senha_hash, cep, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        dados.nome,
        dados.email,
        senhaHash,
        dados.cep,
        endereco.bairro,
        endereco.localidade,
        endereco.uf,
      ],
    );

    const idNovo = (resultado as any).insertId;

    // copia os problemas modelo para o novo cidadão
    await this.db.query(
      `INSERT INTO problema (cidadao_id, titulo, descricao, imagem_url, endereco, bairro, cidade, estado)
       SELECT ?, titulo, descricao, imagem_url, endereco, bairro, cidade, estado
       FROM problema WHERE cidadao_id IS NULL`,
      [idNovo],
    );

    return { mensagem: 'Cadastro feito!' };
  }

// FAZER LOGIB

  async login(loginDto: LoginDto) {
    const [lista] = await this.db.query(
      'SELECT id, senha_hash FROM cidadao WHERE email = ?',
      [loginDto.email],
    );

    if ((lista as any[]).length === 0) {
      throw new BadRequestException(
        'Email não cadastrado, cadastre-se para continuar',
      );
    }

    const usuario = (lista as any[])[0];

    const testeSenha = await bcrypt.compare(loginDto.senha, usuario.senha_hash);

    if (!testeSenha) {
      throw new BadRequestException('Senha ou login incorretos');
    }

    const token = await this.jwtService.signAsync({ sub: usuario.id });

    return {
      mensagem: 'login realizado com sucesso',
      token: token,
    };
  }

// JWT

  async pegarIdDoToken(cabecalho: string) {
    if (!cabecalho) {
      throw new UnauthorizedException('Faça login');
    }

    const token = cabecalho.replace('Bearer ', '');

    try {
      const dadosToken: any = await this.jwtService.verifyAsync(token);
      return dadosToken.sub;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

// CARREGAR PERFIL

  async perfil(cabecalho: string) {
    const id = await this.pegarIdDoToken(cabecalho);

    const [lista] = await this.db.query(
      'SELECT nome, email, cep, complemento, bairro, cidade, estado FROM cidadao WHERE id = ?',
      [id],
    );

    const usuario = (lista as any[])[0];

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return usuario;
  }


async atualizarPerfil(cabecalho: string, dados: AtualizarPerfilDto) {
  const id = await this.pegarIdDoToken(cabecalho);

  const [outros] = await this.db.query(
    'SELECT id FROM cidadao WHERE email = ? AND id <> ?',
    [dados.email, id],
  );

  if ((outros as any[]).length > 0) {
    throw new BadRequestException('Este e-mail já está em uso');
  }

  // troca de senha (opcional)
  let novoHash: string | null = null;

  if (dados.novaSenha) {
    if (!dados.senhaAtual) {
      throw new BadRequestException('Informe a senha atual');
    }

    const [lista] = await this.db.query(
      'SELECT senha_hash FROM cidadao WHERE id = ?',
      [id],
    );

    const usuario = (lista as any[])[0];

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const confere = await bcrypt.compare(dados.senhaAtual, usuario.senha_hash);

    if (!confere) {
      throw new BadRequestException('Senha atual incorreta');
    }

    novoHash = await bcrypt.hash(dados.novaSenha, 10);
  }

  const endereco = await this.buscarCep(dados.cep);

  await this.db.query(
    `UPDATE cidadao
     SET nome = ?, email = ?, cep = ?, bairro = ?, cidade = ?, estado = ?, complemento = ?,
         senha_hash = COALESCE(?, senha_hash)
     WHERE id = ?`,
    [
      dados.nome,
      dados.email,
      dados.cep,
      endereco.bairro,
      endereco.localidade,
      endereco.uf,
      dados.complemento,
      novoHash, // null mantém a senha atual
      id,
    ],
  );

  return {
    mensagem: novoHash ? 'Perfil e senha atualizados!' : 'Perfil atualizado!',
  };
}

  
}