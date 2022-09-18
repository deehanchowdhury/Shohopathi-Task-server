const express = require('express')
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb');

const mongodb = require('./mongodb')  


// const books = [{
		
// 		bookID: "1",
// 		bookName: "Rudest Book Ever",
// 		bookAuthor: "Shwetabh Gangwar",
// 		bookState: "Available"
// 	},
// 	{
// 		bookID: "2",
// 		bookName: "Do Epic Shit",
// 		bookAuthor: "Ankur Wariko",
// 		bookState: "Available"
// 	}
// ]

async function main(){

	const uri = "mongodb+srv://deehan:deehan1997@cluster0.7jxxgwk.mongodb.net/?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri);

	
		await client.connect();

		const books =await mongodb.findAllBooks(client);
		
		if (books.length > 0) {
			console.log(`app Found all listing in the collection`);
			books.forEach((result, i) => {
				
				console.log();
				console.log(`${i + 1}. BookName: ${result.BookName}`);
				console.log(`   _id: ${result._id}`);
				console.log(`   Author: ${result.Author}`);
				console.log(`   Genre: ${result.Genre}`);
			});

			const app = express()

			app.set('view engine', 'ejs')

			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({
				extended: true
			}))

			app.get("/", function (req, res) {
				res.render("home", {
					data: books
				})
			})

			app.post("/", (req, res) => {
				
				const inputBookName = req.body.BookName
				const inputBookAuthor = req.body.Author
				const inputBookGenre = req.body.Genre
				const inputBookPdf = req.body.pdf
				newListing = {
					
					BookName: inputBookName,
					Author: inputBookAuthor,
					Genre: inputBookGenre,
					pdf: inputBookPdf
				}
				mongodb.createListing(client,newListing).then(insertedId => {
					books.push({
						_id : insertedId,
						BookName: inputBookName,
						Author: inputBookAuthor,
						Genre: inputBookGenre,
						pdf: inputBookPdf
					})
		
					res.render("home", {
						data: books
					})
				});

				// books.push({
				// 	_id : insertedId,
				// 	BookName: inputBookName,
				// 	Author: inputBookAuthor,
				// 	Genre: inputBookGenre
				// })

				// res.render("home", {
				// 	data: books
				// })
			})

			app.post('/update', (req, res) => {
				var requestedBookID = req.body._id;
				books.forEach(book => {
					if (book._id == requestedBookID) {
						res.render("update", {
							data: book
							
						})
					}
				})
				
			})

			app.post('/updated', (req, res) => {

				const requestedBookID = req.body._id;
				const inputBookName = req.body.BookName
				const inputBookAuthor = req.body.Author
				const inputBookGenre = req.body.Genre
				const newListing = {
					BookName : req.body.BookName,
					Author : req.body.Author,
					Genre : req.body.Genre,
					pdf : req.body.pdf
				}
				mongodb.updateListingbyID(client,requestedBookID, newListing)

				books.forEach(book => {
					if (book._id == requestedBookID) {
						book.BookName = inputBookName;
						book.Author = inputBookAuthor;
						book.Genre = inputBookGenre;
						book.pdf = req.body.pdf
					}
				})
				res.render("home", {
					data: books
				})
			})

			// app.post('/return', (req, res) => {
			// 	var requestedBookName = req.body.bookName;
			// 	books.forEach(book => {
			// 		if (book.bookName == requestedBookName) {
			// 			book.bookState = "Available";
			// 		}
			// 	})
			// 	res.render("home", {
			// 		data: books
			// 	})
			// })

			app.post('/delete', (req, res) => {
				var requestedBookID = req.body._id;
				var j = 0;
				books.forEach(book => {
					j = j + 1;
					if (book._id == requestedBookID) {
						books.splice((j - 1), 1)
					}
				})
				mongodb.deleteListing(client,requestedBookID)
				res.render("home", {
					data: books
				})
			})

			app.listen(3000, (req, res) => {
				console.log("App is running on port 3000")
			})

		} else {
			console.log(`app No listings found`);
		}

}


main()


// const app = express()

// app.set('view engine', 'ejs')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
// 	extended: true
// }))

// app.get("/", function (req, res) {
// 	res.render("home", {
// 		data: books
// 	})
// })

// app.post("/", (req, res) => {
// 	const inputBookID = req.body.bookID
// 	const inputBookName = req.body.bookName
// 	const inputBookAuthor = req.body.bookAuthor

// 	books.push({
// 		bookID: inputBookID,
// 		bookName: inputBookName,
// 		bookAuthor: inputBookAuthor,
// 		bookState: "Available"
// 	})

// 	res.render("home", {
// 		data: books
// 	})
// })

// app.post('/update', (req, res) => {
// 	var requestedBookID = req.body.bookID;
// 	books.forEach(book => {
// 		if (book.bookID == requestedBookID) {
// 			res.render("update", {
// 				data: book
				
// 			})
// 		}
// 	})
	
// })

// app.post('/updated', (req, res) => {
// 	var requestedBookID = req.body.bookID;
// 	books.forEach(book => {
// 		if (book.bookID == requestedBookID) {
// 			book.bookName = req.body.bookName;
// 			book.bookAuthor = req.body.bookAuthor;
// 			book.bookState = "Updated";
// 		}
// 	})
// 	res.render("home", {
// 		data: books
// 	})
// })

// // app.post('/return', (req, res) => {
// // 	var requestedBookName = req.body.bookName;
// // 	books.forEach(book => {
// // 		if (book.bookName == requestedBookName) {
// // 			book.bookState = "Available";
// // 		}
// // 	})
// // 	res.render("home", {
// // 		data: books
// // 	})
// // })

// app.post('/delete', (req, res) => {
// 	var requestedBookID = req.body.bookID;
// 	var j = 0;
// 	books.forEach(book => {
// 		j = j + 1;
// 		if (book.bookID == requestedBookID) {
// 			books.splice((j - 1), 1)
// 		}
// 	})
// 	res.render("home", {
// 		data: books
// 	})
// })

// app.listen(3000, (req, res) => {
// 	console.log("App is running on port 3000")
// })
