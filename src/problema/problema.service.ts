import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class ProblemaService {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  async buscarTodos(idCidadao: number) {
    const [resultado] = await this.db.query(
      'SELECT * FROM problema WHERE cidadao_id = ? ORDER BY criado_em DESC',
      [idCidadao],
    );

    return resultado;
  }

  async buscarPorId(id: number, idCidadao: number) {
    const [resultado] = await this.db.query(
      'SELECT * FROM problema WHERE id = ? AND cidadao_id = ?',
      [id, idCidadao],
    );

    const problemas = resultado as any[];

    if (problemas.length === 0) {
      throw new NotFoundException('Problema não encontrado');
    }

    return problemas[0];
  }

  async criar(dados: any, idCidadao: number) {
    await this.db.query(
      `INSERT INTO problema (cidadao_id, titulo, descricao, imagem_url, endereco, bairro, cidade, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idCidadao,
        dados.titulo,
        dados.descricao,
        dados.imagem_url ?? null,
        dados.endereco,
        dados.bairro,
        dados.cidade,
        dados.estado,
      ],
    );

    return { mensagem: 'Problema criado com sucesso' };
  }

  async atualizar(id: number, dados: any, endereco: any, idCidadao: number) {
    if (!dados.titulo || !dados.descricao) {
      throw new BadRequestException('Preencha título e descrição');
    }

    const [resultado] = await this.db.query(
      `UPDATE problema
       SET titulo = ?,
           descricao = ?,
           complemento = ?,
           endereco = COALESCE(NULLIF(?, ''), endereco),
           cep = COALESCE(?, cep),
           bairro = COALESCE(?, bairro),
           cidade = COALESCE(?, cidade),
           estado = COALESCE(?, estado)
       WHERE id = ? AND cidadao_id = ?`,
      [
        dados.titulo,
        dados.descricao,
        dados.complemento || null,
        endereco ? endereco.logradouro : null,
        endereco ? dados.cep : null,
        endereco ? endereco.bairro : null,
        endereco ? endereco.localidade : null,
        endereco ? endereco.uf : null,
        id,
        idCidadao,
      ],
    );

    const resultadoUpdate = resultado as any;

    if (resultadoUpdate.affectedRows === 0) {
      throw new NotFoundException('Problema não encontrado');
    }

    return { mensagem: 'Problema atualizado com sucesso' };
  }

  async excluir(id: number, idCidadao: number) {
    const [resultado] = await this.db.query(
      'DELETE FROM problema WHERE id = ? AND cidadao_id = ?',
      [id, idCidadao],
    );

    const resultadoDelete = resultado as any;

    if (resultadoDelete.affectedRows === 0) {
      throw new NotFoundException('Problema não encontrado');
    }

    return { mensagem: 'Problema excluído com sucesso' };
  }
}