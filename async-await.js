const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

async function findAll() {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log('s2');
    console.log(err);
  });
  if (!client) return;

  try {
    console.log('1');
    const db = client.db('mydb');
    console.log('2');
    let collection = db.collection('customers');
    console.log('3');
    let cursor = collection.find({}).limit(10);
    console.log('4');
    await cursor.forEach((doc) => console.log(doc));
    console.log('5');
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}
setTimeout(() => {
  findAll();
  console.log('iter');
}, 5000);

// using promise
// const { MongoClient } = require('mongodb');
// const url = 'mongodb://localhost:27017';

// function findAll() {
//   return new Promise((resolve, reject) => {
//     MongoClient.connect(url, (err, client) => {
//       if (err) {
//         console.log('s2');
//         console.error(err);
//         reject(err);
//         return;
//       }

//       const db = client.db('mydb');
//       const collection = db.collection('customers');
//       const cursor = collection.find({}).limit(10);

//       cursor.toArray((err, docs) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//           return;
//         }

//         client.close();
//         resolve(docs);
//       });
//     });
//   });
// }

// setTimeout(() => {
//   findAll()
//     .then((docs) => {
//       console.log('Documents found:');
//       console.log(docs);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
//   console.log('iter');
// }, 5000);
