/****************************************************************************** ***
 *	ITE5315 – Assignment 4
 *	I declare that this assignment is my own work in accordance with Humber Academic Policy.   *  No part of this assignment has been copied manually or electronically from any other source *  (including web sites) or distributed to other students.
 *
 *	Name: Vivek Jethva Student ID: N01579474 Date: 23/03/2024
 *
 *
 ******************************************************************************
 **/

var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path'); // import path
var database = require('./config/database');
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
const exphbs = require('express-handlebars'); // import handlebars middleware

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.engine(
  '.hbs',
  exphbs.engine({
    extname: '.hbs',
    helpers: {
      //  helper method to check if average review is empty or not.
      is_avg_reviewEmpty: function (avg_reviews) {
        return avg_reviews !== null &&
          avg_reviews !== undefined &&
          avg_reviews !== ''
          ? avg_reviews
          : 'N/A';
      },
    },
  })
);

app.set('view engine', 'hbs');
mongoose.connect(database.url);

// var Employee = require('./models/employee');
var Book = require('./models/books');

//get all employee data from db
app.get('/api/employees', function (req, res) {
  // use mongoose to get all todos in the database
  Employee.find(function (err, employees) {
    // if there is an error retrieving, send the error otherwise send data
    if (err) res.send(err);
    res.json(employees); // return all employees in JSON format
  });
});

// get a employee with ID of 1
app.get('/api/employees/:employee_id', function (req, res) {
  let id = req.params.employee_id;
  Employee.findById(id, function (err, employee) {
    if (err) res.send(err);

    res.json(employee);
  });
});

// create employee and send back all employees after creation
app.post('/api/employees', function (req, res) {
  // create mongose method to create a new record into collection
  console.log(req.body);

  Employee.create(
    {
      name: req.body.name,
      salary: req.body.salary,
      age: req.body.age,
    },
    function (err, employee) {
      if (err) res.send(err);

      // get and return all the employees after newly created employe record
      Employee.find(function (err, employees) {
        if (err) res.send(err);
        res.json(employees);
      });
    }
  );
});

// -------------- updated code  for post method ------------
// create employee and send back all employees after creation
// app.post('/api/employees', function (req, res) {
//   // create mongoose method to create a new record into collection
//   console.log(req.body);

//   Employee.create({
//     name: req.body.name,
//     salary: req.body.salary,
//     age: req.body.age,
//   })
//     .then((employee) => {
//       // get and return all the employees after newly created employee record
//       return Employee.find();
//     })
//     .then((employees) => {
//       res.json(employees);
//     })
//     .catch((err) => {
//       res.status(500).send(err); // if there's an error, send the error response
//     });
// });

// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', function (req, res) {
  // create mongose method to update an existing record into collection
  console.log(req.body);

  let id = req.params.employee_id;
  var data = {
    name: req.body.name,
    salary: req.body.salary,
    age: req.body.age,
  };

  // save the user
  Employee.findByIdAndUpdate(id, data, function (err, employee) {
    if (err) throw err;

    res.send('Successfully! Employee updated - ' + employee.name);
  });
});

// delete a employee by id
app.delete('/api/employees/:employee_id', function (req, res) {
  console.log(req.params.employee_id);
  let id = req.params.employee_id;
  Employee.remove(
    {
      _id: id,
    },
    function (err) {
      if (err) res.send(err);
      else res.send('Successfully! Employee has been Deleted.');
    }
  );
});
//  ----------------------------- Question 2 Book -----------------------

app.get('/allData', (req, res) => {
  Book.find()
    .exec()
    .then((books) => res.json(books))
    .catch((error) => res.status(400).json('Error :' + error));
});

// get a book with ISBN_ID
app.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  Book.findOne({ ISBN_13: isbn })
    .exec()
    .then((book) => {
      if (!book) {
        return res.json({ error: 'Book is not found by provided isbn' });
      }
      res.json(book);
    })
    .catch((err) => {
      res.send(err);
    });
});

//Post Methid - Insert a new book to the database
app.post('/insertBook', function (req, res) {
  Book.create({
    title: req.body['title'],
    author: req.body['author'],
    price: req.body['price'],
    'price (including used books)': req.body['price (including used books)'],
    pages: req.body['pages'],
    avg_reviews: req.body['avg_reviews'],
    n_reviews: req.body['n_reviews'],
    star: req.body['star'],
    dimensions: req.body['dimensions'],
    weight: req.body['weight'],
    language: req.body['language'],
    publisher: req.body['publisher'],
    ISBN: req.body['ISBN'],
    complete_link: req.body['complete_link'],
  })
    .then((book) => {
      return res.send('Book has been inserted successfully!');
    })
    .catch((err) => {
      res.send(err);
    });
});

// Delete a book by isbn
app.delete('/deleteIsbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  Book.deleteOne({ ISBN_13: isbn })
    .then((result) => res.send('Book has been deleted successfully!' + isbn))
    .catch((err) => res.send(err));
});

// Update book by isbn number
app.put('/updateBook/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  var data = {
    title: req.body['title'],
    price: req.body['price'],
  };
  // save the data
  Book.findOneAndUpdate({ ISBN_13: isbn }, data)
    .exec()
    .then((book) => {
      res.send('Book has been Updated successfully!');
    })
    .catch((err) => {
      res.send(err);
    });
});
// Step3
// Show All Book Information
app.get('/data', (req, res) => {
  Book.find()
    .lean()
    .exec()
    .then((books) => {
      res.render('allData', { title: 'All Books info - ', data: books });
    })
    .catch((err) => {
      res.send(err);
    });
});

//Insert a new book
app.get('/insertBook', (req, res) => {
  res.render('insertBook', { title: 'Insert Book Form' });
});

app.post('/insertBook', (req, res) => {
  Book.create({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    pages: req.body.pages,
    avg_reviews: req.body.avg_reviews,
    n_reviews: req.body.n_reviews,
    star: req.body.star,
    dimensions: req.body.dimensions,
    weight: req.body.weight,
    language: req.body.language,
    publisher: req.body.publisher,
    ISBN: req.body.ISBN,
    complete_link: req.body.complete_link,
  })
    .then((book) => {
      console.log(book);
      return res.render('insertBookToDB', { title: 'Success Book' });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port);
console.log('App listening on port : ' + port);
