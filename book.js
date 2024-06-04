class Book {
  constructor(id, titulo, autor, edicao, dataPublicacao, qntDisponivel) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.edicao = edicao;
    this.dataPublicacao = dataPublicacao;
    this.qntDisponivel = qntDisponivel;
  }
}

module.exports = Book;
