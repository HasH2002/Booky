require("dotenv").config();

const express = require ("express");
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
//Database

const database = require("./database/database");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//initialise express

const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL).then(() => console.log("connection established"))

booky.get("/",async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

 


/*
route               /
Description         get all the books
Access              public
Parameter           isbn
Methods             Get
*/

booky.get("/is/:isbn",async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn});
    
    if(!getSpecificBook){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }
    return res.json({book: getSpecificBook});
});

/*
route               /c/:category
Description         get all the books by category
Access              public
Parameter           category
Methods             Get
*/

booky.get("/c/:category", async(req,res) =>{
    const getSpecificBook = await BookModel.findOne({category:req.params.category});
    
    if(!getSpecificBook){
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }
    return res.json({book: getSpecificBook});
});


/*
route               /l/:language
Description         get all the books by languages
Access              public
Parameter           language
Methods             Get
*/

booky.get("/l/:language", async(req,res) =>{
    const getSpecificBook = await BookModel.findOne({language:req.params.language});
    
    if(!getSpecificBook){
        return res.json({error: `No book found for the language of ${req.params.language}`})
    }
    return res.json({book: getSpecificBook});
});

/*
route               /:author
Description         get all the author
Access              public
Parameter           none
Methods             Get
*/

booky.get("/author",async(req,res) =>{
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

/*
route               /authors/id
Description         get author by id
Access              public
Parameter           id
Methods             Get
*/

booky.get("/author/:id", async(req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({id:req.params.id})
    if(!getSpecificAuthor){
        return res.json({error: `No author found for the ID of ${req.params.id}`})
    }
    return res.json({Author: getSpecificAuthor});
});



/*
route               /author/b/:book
Description         get author by book
Access              public
Parameter           book
Methods             Get
*/

booky.get("/author/b/:books",async (req,res) =>{
    const getSpecificAuthor = await AuthorModel.findOne({books:req.params.books})
    if(!getSpecificAuthor){
        return res.json({error: `No author found for the books of ${req.params.books}`})
    }
    return res.json({Author: getSpecificAuthor});
});

/*
route               /publication
Description         get all publication
Access              public
Parameter           none
Methods             Get
*/
booky.get("/publication",async(req,res) =>{
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

/*
route               /publication/:id
Description         get all publication
Access              public
Parameter           none
Methods             Get
*/


booky.get("/publication/:id",async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({id:req.params.id})
    if(!getSpecificPublication){
        return res.json({error: `No publication found for the ID of ${req.params.id}`})
    }
    return res.json({publication: getSpecificPublication});
});

/*
route               /publication/book/:bookname
Description         get publication by book
Access              public
Parameter           book
Methods             Get
*/

booky.get("/bookname/:book",async (req,res) =>{
    const getSpecificPublication = await PublicationModel.findOne({book:req.params.book})
    if(!getSpecificPublication){
        return res.json({error: `No publication found for the ID of ${req.params.book}`})
    }
    return res.json({publication: getSpecificPublication});
});

                  //POST

/*
route               /book/new
Description         add new books
Access              public
Parameter           none
Methods             post
*/

booky.post("/book/new",async (req,res) => {
   const { newBook } = req.body;
   const addNewBook = BookModel.create(newBook);
   return res.json({
       books: addNewBook,
       message: "Book was added !!!!"
   });
});

/*
route               /author/new
Description         add new author
Access              public
Parameter           none
Methods             post
*/

booky.post("/author/new", async(req,res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json(
        {
            author: addNewAuthor,
            message: "Author was added !!!!"
        }
    );
});

/*
route               /publication/new
Description         add new publications
Access              public
Parameter           none
Methods             post
*/

booky.post("/publication/new", (req,res) => {
    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json(
        {
            author: addNewPublication,
            message: "Publication was added!!!"
        }
    );
});
                             
                              //UPDATE


                              //Update a book
/*
route               /book/update/:isbn
Description         update  a book
Access              public
Parameter           isbn
Methods             put
*/

booky.put("/book/update/:isbn", async(req,res) => {
    const {updatedBook} = await BookModel.findOneAndUpdate(
    {
        ISBN: req.params.isbn
    },
    {
        title: req.body.bookTitle
    },
    {
        new: true
    }
    );
    return res.json({
        books: updatedBook
    });
});

//Update a author

/*
route               /authorupdate/:id
Description         update author
Access              public
Parameter           id
Methods             put
*/
booky.put("/book/author/update/:isbn",async(req,res) =>{
    //update book database
const updatedBook = await BookModel.findOneAndUpdate(
    {
        ISBN: req.params.isbn
    },
    {
        $addToSet: {
            authors: req.body.newAuthor
        }
    },
    {
        new: true
    }
);

    //update author database
    const updateauthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

   return res.json(
       {
       books: updatedBook,
       authors: updateauthor,
       message: "New Author was added"
   }
   );
});


/*
route               /authorupdate/:id
Description         update author
Access              public
Parameter           id
Methods             put
*/

booky.put("/updateauthor/:id", async(req,res) => {
    const {updateAuthor} = await AuthorModel.findOneAndUpdate(
    {
        id: req.params.id
    },
    {
        books : req.body.authorBooks
    },
    {
        new: true
    }
    );
    return res.json({
        author: updateAuthor
    });
});


//Update a publication
/*
route               /publicationupdate/:
Description         update publication
Access              public
Parameter           id
Methods             put
*/

booky.put("/updatepublication/:id",async(req,res) => {
    const {updatePublication} = await PublicationModel.findOneAndUpdate(
    {
        id: req.params.id
    },
    {
        books : req.body.publicationBooks
    },
    {
        new: true
    }
    );
    return res.json({
        publication: updatePublication
    });
});

/*
route               /publication/update/book
Description         update or add new publication
Access              public
Parameter           isbn
Methods             put
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
    //update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubid){
          return pub.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) =>{
        if(book.ISBN===req.params.isbn){
            book.publications = req.body.pubid;
            return;
        }
    });
    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "successfully updated publications"
        }
    );
});

                                       //DELETE


/*
route               /book/delete
Description         delete a book
Access              public
Parameter           isbn
Methods             delete
*/

booky.delete("/book/delete/:isbn", async(req,res) => {
const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
        ISBN: req.params.isbn
    }
);
return res.json({
    books: updatedBookDatabase
});
});


/*route               /author/delete
  Description         delete an author
  Access              public
  parameter           author id
  methods             delete
  */

  booky.delete("/author/delete/:id", async(req,res) => {
    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete(
        {
            id: req.params.id
        }
    );
    return res.json({
        author: updatedAuthorDatabase
    });
    });



/*
route               /book/delete/author
Description         delete a book
Access              public
Parameter           isbn
Methods             delete
*/

booky.delete("/book/delete/author/:isbn/:authorid", (req,res) => {
    //Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorlist=book.author.filter(
                (eachAuthor) => eachAuthor != parseInt(req.params.authorid)
            );
            book.author = newAuthorlist;
            return;
        }
    });
    //update the author
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorid)){
            const newBookList = eachAuthor.books.filter(
                (book) => book != req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!!!"
    });
});


/*route               /publication/delete
  Description         delete an publication
  Access              public
  parameter           publication id
  methods             delete
  */

  booky.delete("/publication/delete/:id", async(req,res) => {
    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete(
        {
            id: req.params.id
        }
    );
    return res.json({
       publication: updatedPublicationDatabase
    });
    });

booky.listen(3000,() => {
    console.log("Server is running");
});