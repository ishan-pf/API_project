const express = require('express');

//initialize express

const bstore = express();

const database = require('./database');

bstore.get("/" , (req, res) => {
    return res.json({books : database.books});
})


bstore.get("/is/:isbn", (req, res) => {

    const getSpecificBook = database.books.filter( (book) => book.ISBN === req.params.isbn
    )
    if(getSpecificBook.length === 0){
        return res.json({error : `No book found with the ISBN NUmber ${req.params.isbn}`});
    }
    return res.json({book : getSpecificBook});
});

bstore.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category))

    if(getSpecificBook.length === 0){
        return res.json({error : `No book found with the category  ${req.params.category}`})

    return res.json({book : getSpecificBook});
    }
})

bstore.get("/ln/:language", (req,res) => {
    const getSpecificBook = database.books.filter((book) => book.language === req.params.language);

    if(getSpecificBook.length === 0){

        return res.json({error : `No book found with the language ${req.params.language}`})
    }
    return res.json({book : getSpecificBook});
})

bstore.get("/author", (req, res) => {

  return res.json({authors : database.author})
})

bstore.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter((author) => author.books.includes(req.params.isbn));

    if(getSpecificAuthor.length === 0){
        return res.json({error : `No author found for the book with isbn ${req.params.isbn}`})
    }

    return res.json({author : getSpecificAuthor});
})

bstore.get("/author/:id" , (req, res) => {
    const getSpecificAuthor = database.author.filter((author) => author.id === parseInt(req.params.id));

    if(getSpecificAuthor.length === 0){
        return res.json({error : `{No author found with id ${req.params.id}}`});

    }

    return res.json({author : getSpecificAuthor});

})



bstore.get("/publications", (req, res) => {
    return res.json({publications : database.publication})
})


bstore.get("/publications/:name" , (req, res) => {

    const getSpecificPublication = database.publication.filter((publication) => publication.name === req.params.name);

    if(getSpecificPublication.length === 0){

        return res.json({error : `No Publication found with the name ${req.params.name}`})
    }

    return res.json({publication : getSpecificPublication});
})

bstore.get("/publications/book/:isbn", (req, res) => {

    const getSpecificPublication = database.publication.filter((publication) => publication.books.includes(req.params.isbn));

    if(getSpecificPublication.length === 0){
        return res.json({error : `No Publication found with the book isbn ${req.params.isbn}`});
    }

    return res.json({publication : getSpecificPublication});
})

bstore.listen(5000, () => {
    console.log("Successfully Excuted")
});

