/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable eol-last */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (Request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = Request.payload;
    const id = nanoid(16);
    const insertAt = new Date().toISOString();
    const updateAt = insertAt;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

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
        finished,
        reading,
        insertAt,
        updateAt,
    };
    books.push(newBook);
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
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name) {
        const response = h.response({
            status: 'success',
            data: {
                books: books
                .filter((b) => b.name === name)
                .map((books) => ({
                    id: books.id,
                    name: books.name,
                    publisher: books.publisher,
                })),
    },
        });
        response.code(200);
        return response;
    }

    if (reading === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: books
                .filter((b) => b.reading === true)
                .map((books) => ({
                    id: books.id,
                    name: books.name,
                    publisher: books.publisher,
                })),
    },
        });
        response.code(200);
        return response;
    }

    if (reading === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: books
                .filter((b) => b.reading === false)
                .map((books) => ({
                    id: books.id,
                    name: books.name,
                    publisher: books.publisher,
                })),
    },
        });
        response.code(200);
        return response;
    }

    if (finished === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: books
                .filter((b) => b.finished === true)
                .map((books) => ({
                    id: books.id,
                    name: books.name,
                    publisher: books.publisher,
                })),
    },
        });
        response.code(200);
        return response;
    }

    if (finished === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: books
                .filter((b) => b.finished === false)
                .map((books) => ({
                    id: books.id,
                    name: books.name,
                    publisher: books.publisher,
                })),
    },
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((books) => ({
                id: books.id,
                name: books.name,
                publisher: books.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book: {
                    ...book,
                    insertedAt: book.insertAt,
                    updatedAt: book.updateAt,
                },
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
    const { id } = request.params;
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
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

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
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};