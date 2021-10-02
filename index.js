require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

//initialize express

const bodyParser = require('body-parser');

const bstore = express();
/*mongodb+srv://phoenix_cloud:<password>@phoenix-fire.p9zo8.mongodb.net/BK_manage?retryWrites=true&w=majority*/
bstore.use(bodyParser.urlencoded({ extended:true}));
bstore.use(bodyParser.json());
const database = require('./database/database');

const BookModel = require("./database/Book");
const AuthorModel = require("./database/Author");
const PublicationModel = require("./database/publication")
mongoose.connect(process.env.MONGO_URL
    ,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
).then(() => console.log("Success"));

bstore.get("/" , async(req, res) => {

    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
})


bstore.get("/is/:isbn", async(req, res) => {

    const getSpecificBook = await BookModel.findOne({ISBN : req.params.isbn})
    if(!getSpecificBook){
        return res.json({error : `No book found with the ISBN Number ${req.params.isbn}`});
    }
    return res.json({book : getSpecificBook});
});

bstore.get("/c/:category", async(req, res) => {
    const getSpecificBook = await BookModel.findOne({Category : req.params.category})
    if(!getSpecificBook){
        return res.json({error : `No book found with the category ${req.params.category}`});
    }
    return res.json({book : getSpecificBook});
})

bstore.get("/ln/:language", async(req,res) => {
    const getSpecificBook = await BookModel.findOne({language : req.params.langauge})
    if(!getSpecificBook){
        return res.json({error : `No book found with the language ${req.params.language}`});
    }
    return res.json({book : getSpecificBook});

})

bstore.get("/author", async(req, res) => {

    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors)
})

bstore.get("/author/book/:isbn", async(req, res) => {
    const getSpecificAuthor = await AuthorModel.find(req.params.isbn);

    if(!getSpecificAuthor){
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



bstore.get("/publications", async(req, res) => {

    getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications)
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

bstore.post("/book/new", async(req, res) => {
        const { newBook } = req.body;

        const addNewBook = BookModel.create(newBook);

        return res.json({
            books : addNewBook,
            Message : "The Book is Add successfully"});
});

bstore.post("/author/new" , async(req, res) => {
    
    const newAuthor = req.body;
    database.author.push(newAuthor);

    return res.json({updatedAuthors: database.author});
});

bstore.post("/publication/new" , (req, res) => {

    const newPublication = req.body;
    database.publication.push(newPublication);

    return res.json({updatedPublication:database.publication});
});


bstore.put("/publication/update/book/:isbn", async(req, res) => {
   const UpdatedBook = await BookModel.findOneAndUpdate(
       
    {
        ISBN : req.params.isbn  

   },
   {
       title : req.body.bookTitle
   },
   {
       new: true
   }
   );

   return res.json({
       books : UpdatedBook
   })
})

bstore.put( "/book/author/update/:isbn" , async(req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate(
        
    {
        ISBN : req.params.isbn 

    },{
        $addToSet : {
            authors : req.params.newAuthor  
        }
    },{
        new : true
    });

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id : req.body.newAuthor

        },
        {
            $addToSet : {
                books : req.body.isbn
            }
        },
        {
            new : true
        }
    )

    return res.json({books:updatedBook, 
        
        authors:updatedAuthor,
    message : "Book and Author updated successfully"})
        
})

bstore.delete("/book/delete/:isbn" , async(req, res) => {

    const updatedBookDB = await BookModel.findOneAndDelete(
        {
            ISBN : req.params.isbn
        }
    );

    return res.json({books : updatedBookDB})
})





bstore.listen(5000, () => {
    console.log("Successfully Excuted")
});

