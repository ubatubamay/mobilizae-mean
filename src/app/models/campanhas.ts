import { Materiais } from './materiais';
import { Vagas } from './vagas';
import { Usuario } from './usuarios';

export class Campanhas {
  _id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  horarios: Date;
  materiais: Materiais[];
  vagas: Vagas[];
  escola: Usuario;
}