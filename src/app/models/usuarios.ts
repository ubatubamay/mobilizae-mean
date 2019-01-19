export interface Usuario {
  userId: string;
  nome: string;
  email: string;
  password: string;
  accessToken: string;
  sobre?: string;
  endereco?: {
    logradouro?: string,
    numero?: number,
    bairro?: string,
    cidade?: string,
    uf?: string
  };
  verificado?: boolean;
}