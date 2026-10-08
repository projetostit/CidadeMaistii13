import { Injectable, NotFoundException } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class ProblemaService {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // BUSCAR TODAS AS DENÚNCIAS DO USUÁRIO LOGADO
  async buscarTodos(idCidadao: number) {
    const [resultado] = await this.db.query(
      'SELECT * FROM problema WHERE cidadao_id = ? ORDER BY criado_em DESC',
      [idCidadao],
    );

    return resultado;
  }

  // BUSCAR UMA DENÚNCIA PELO ID
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

  // CRIAR UMA DENÚNCIA
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

  // ATUALIZAR UMA DENÚNCIA
  async atualizar(id: number, dados: any, idCidadao: number) {
    const [resultado] = await this.db.query(
      'UPDATE problema SET titulo = ?, descricao = ?, status = ? WHERE id = ? AND cidadao_id = ?',
      [dados.titulo, dados.descricao, dados.status, id, idCidadao],
    );

    const resultadoUpdate = resultado as any;

    if (resultadoUpdate.affectedRows === 0) {
      throw new NotFoundException('Problema não encontrado');
    }

    return { mensagem: 'Problema atualizado com sucesso' };
  }

  // EXCLUIR UMA DENÚNCIA (só a do próprio usuário)
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