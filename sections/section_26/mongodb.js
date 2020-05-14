// MONGO SHELL
show dbs

// CREATE
use shopDB
db.products.insertOne({
  _id: 1,
  name: 'Pen',
  price: 1.20
})
show.collections

db.products.insertOne({
  _id: 2,
  name: 'Pencil',
  price: 0.80,
  stock: 12
})

// READ
db.products.find()
db.products.find({stock: {$exists: true}})
db.products.find({stock: {$exists: true}}, {name: 1, price:1, stock: 1, _id: 0})

// UPDATE

db.products.updateOne({_id: 1}, {$set: {stock: 32}})
db.products.find({stock: {$exists: true}}, {name: 1, price:1, stock: 1, _id: 0})

// DELETE
db.products.insertOne({
  _id: 3,
  name: 'Rubber',
  price: 0.60,
  stock: 42
})
db.products.find({stock: {$exists: true}}, {name: 1, price:1, stock: 1, _id: 0})

// RELATIONSHIPS
db.products.insertOne({
  _id: 3,
  name: 'Rubber',
  price: 0.60,
  stock: 42,
  reviews: [
    {
      authorName: 'Sally',
      rating: 5,
      review: 'Great product!'
    },
    {
      authorName: 'Billy',
      rating: 1,
      review: 'Hated it!'
    }
  ]
})
db.products.find({stock: {$exists: true}})
db.products.find(
  {
    stock: {
      $exists: true
    },
    reviews: {
      $exists: true
    }
  }
)
db.products.find(
  {
    stock: {
      $exists: true
    },
    reviews: {
      $exists: false
    }
  }
)
