export abstract class AbstractRepository<T> {
  abstract salvar(entity: T): Promise<T>;

  abstract atualizar(entity: T): Promise<T>;

  abstract criar(entity: T): Promise<T>;

  abstract bucarUm(id: number): Promise<T>;

  abstract bucarPorId(id: number): Promise<T> | Promise<T | T[]>;

  abstract buscarPorCondicao(filtro: any): Promise<T>;

  abstract buscarTodos(): Promise<T[] | T>;

  abstract remove(id: string): Promise<any>;
}
