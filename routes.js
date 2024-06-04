const express = require("express");
const Book = require("./book");
const connection = require("./db");

const router = express.Router();
module.exports = router;

router.get("/books", async (req, res) => {
  try {
    const booksQuery = "SELECT * FROM livros";
    connection.query(booksQuery, (error, results) => {
      if (error) {
        console.error("Erro ao listar livros:", error);
        return res.status(500).send("Erro interno do servidor.");
      }
      const mappedBooks = results.map(
        (book) =>
          new Book(
            book.id,
            book.titulo,
            book.autor,
            book.edicao,
            book.dataPublicacao,
            book.qntDisponivel
          )
      );
      res.json(mappedBooks);
    });
  } catch (error) {
    console.error("Erro ao listar livros:", error);
    res.status(500).send("Erro interno do servidor.");
  }
});

router.get("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const bookQuery = `SELECT * FROM livros WHERE id = ${bookId}`;
    connection.query(bookQuery, [bookId], (error, results) => {
      if (error) {
        console.error("Erro ao buscar livro:", error);
        return res.status(500).send("Erro interno do servidor.");
      }
      if (results.length === 0) {
        return res.status(404).send("Livro não encontrado.");
      }
      const mappedBook = new Book(
        results[0].id,
        results[0].titulo,
        results[0].autor,
        results[0].edicao,
        results[0].dataPublicacao,
        results[0].qntDisponivel
      );
      res.json(mappedBook);
    });
  } catch (error) {
    console.error("Erro ao buscar livro:", error);
    res.status(500).send("Erro interno do servidor.");
  }
});

// Route to create a new book
router.post("/books", async (req, res) => {
  const newBook = new Book(
    null,
    req.body.titulo,
    req.body.autor,
    req.body.edicao,
    req.body.dataPublicacao,
    req.body.qntDisponivel
  );
  try {
    const insertQuery =
      "INSERT INTO livros (titulo, autor, edicao, dataPublicacao, qntDisponivel) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      insertQuery,
      [
        newBook.titulo,
        newBook.autor,
        newBook.edicao,
        newBook.dataPublicacao,
        newBook.qntDisponivel,
      ],
      (error, results) => {
        if (error) {
          console.error("Erro ao criar livro:", error);
          return res.status(500).send("Erro interno do servidor.");
        }
        newBook.id = results.insertId;
        res.status(201).json(newBook);
      }
    );
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    res.status(500).send("Erro interno do servidor.");
  }

  router.delete("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
      const deleteQuery = `DELETE FROM livros WHERE id = ${bookId}`;
      connection.query(deleteQuery, (error, results) => {
        if (error) {
          console.error("Erro ao excluir livro:", error);
          return res.status(500).send("Erro interno do servidor.");
        }
        if (results.affectedRows === 0) {
          return res.status(404).send("Livro não encontrado.");
        }
        res.status(200).send("Livro excluído com sucesso.");
      });
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
      res.status(500).send("Erro interno do servidor.");
    }
  });

  router.put("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { titulo, autor, edicao, dataPublicacao, qntDisponivel } = req.body;
  
    try {
      const updateQuery = `
        UPDATE livros
        SET 
          titulo = ?,
          autor = ?,
          edicao = ?,
          dataPublicacao = ?,
          qntDisponivel = ?
        WHERE id = ?`;
        
      connection.query(
        updateQuery,
        [titulo, autor, edicao, dataPublicacao, qntDisponivel, bookId],
        (error, results) => {
          if (error) {
            console.error("Erro ao atualizar livro:", error);
            return res.status(500).send("Erro interno do servidor.");
          }
          if (results.affectedRows === 0) {
            return res.status(404).send("Livro não encontrado.");
          }
          res.status(200).send("Livro atualizado com sucesso.");
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      res.status(500).send("Erro interno do servidor.");
    }
  });
});

