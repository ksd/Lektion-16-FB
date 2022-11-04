import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, doc, deleteDoc } from 'firebase/firestore'

import express, { response } from 'express'
import pug from 'pug'

const app = express()
app.set('view engine', 'pug')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const firebaseConfig = {
  // COPY YOUR OWN
}

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

// Firebase functioner
let carsCollection = collection(db, 'cars')

async function getCars() {
  let carsQueryDocs = await getDocs(carsCollection)
  let cars = carsQueryDocs.docs.map(doc => {
    let data = doc.data()
    data.docID = doc.id
    return data
  })
  return cars
}

async function getCar(id) {
  const docRef = doc(db, "cars", id)
  const carQueryDocument = await getDoc(docRef)
  let car = carQueryDocument.data()
  car.docID = carQueryDocument.id
  return car
}

async function deleteCar(id) {
  const deletedCar = await deleteDoc(doc(db, "cars", id))
  let car = deletedCar.data()
  car.docID = deletedCar.id
  return car
}

// express endpoint
app.get('/cars', async (request, response) => {
  const cars = await getCars()
  response.render('cars', { biler: cars })
})

app.get('/car/:id', async (request, response) => {
  const carID = request.params.id
  const car = await getCar(carID)
  response.render('car', { bil: car })
})

app.delete('/car/:id', async (request, response) => {
  const carID = request.params.id
  const deletedCar = await deleteCar(carID)
  response.status(200)
  response.end()
})

app.get('/addCar', (request, response) => {
  response.render('addCar', {})
})
app.post('/addCar', async (request, response) => {
  //TO-DO: OPRET BIL I  FBDB
})

app.listen(8000, () => {
  console.log('Roads?, where we are going we dont need no roads')
})