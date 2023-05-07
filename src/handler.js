/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const checkName = Object.prototype.hasOwnProperty.call(
    request.payload,
    'name',
  );

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  if (!checkName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount >= readPage) {
    books.push(newBook);
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  let responseBody;
  const { name, reading, finished } = request.query;
  if (name) {
    const array = [];
    for (let i = 0; i < books.length; i += 1) {
      if (books[i].name.toLowerCase().includes(name.toLowerCase())) {
        const { id, name, publisher } = books[i];
        array.push({ id, name, publisher });
      }
    }
    responseBody = {
      status: 'success',
      data: {
        books: array,
      },
    };
    return responseBody;
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    const array = [];
    for (let i = 0; i < books.length; i += 1) {
      if (books[i].reading === isReading) {
        const { id, name, publisher } = books[i];
        array.push({ id, name, publisher });
      }
    }
    responseBody = {
      status: 'success',
      data: {
        books: array,
      },
    };
    return responseBody;
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    const array = [];
    for (let i = 0; i < books.length; i += 1) {
      if (isFinished === books[i].finished || finished === undefined) {
        const { id, name, publisher } = books[i];
        array.push({ id, name, publisher });
      }
    }
    responseBody = {
      status: 'success',
      data: {
        books: array,
      },
    };
    return responseBody;
  }
  if (!name && !reading && !finished) {
    const array = [];
    for (let i = 0; i < books.length; i += 1) {
      const { id, name, publisher } = books[i];
      array.push({ id, name, publisher });
    }
    responseBody = {
      status: 'success',
      data: {
        books: array,
      },
    };
    return responseBody;
  }

  if (books.length > 0 && !name && !reading && !finished) {
    const array = [];
    for (let i = 0; i < books.length; i += 1) {
      array.push({
        id: books[i].id,
        name: books[i].name,
        publisher: books[i].publisher,
      });
    }
    responseBody = {
      status: 'success',
      data: {
        books: array,
      },
    };
    return responseBody;
  }
  responseBody = {
    status: 'success',
    data: {
      books,
    },
  };
  return responseBody;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
  }
  return h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
};
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
