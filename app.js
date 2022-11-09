import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'

import express, { response } from 'express'

import pug from 'pug'
const app = express()
app.set('view engine', 'pug')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('assets'))

const firebaseConfig = {

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
  //let car = deletedCar.data()
  //car.docID = deletedCar.id
  //return car
}

async function addCar(car) {
  // car = {brand: 'Citroen', model: 'Xantia'}
  const docRef = await addDoc(collection(db, "cars"), car);
  return docRef.id
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

app.delete('/deleteCar/:id', async (request, response) => {
  const carID = request.params.id
  console.log(carID);
  await deleteCar(carID)
  response.status(201)
  response.end()
})

app.get('/addCar', (request, response) => {
  response.render('addCar', {})
})
app.post('/addCar', async (request, response) => {
  const brand = request.body.brand
  const model = request.body.model
  // ALT hvad der kommer fra brugeren er en string
  // I skal lave en fandens masse check
  // STOL ALDRIG PÅ BRUGERDATA
  let id = await addCar({ brand: brand, model: model })
  response.redirect('/cars')
})

app.listen(8000, () => {
  console.log('Roads?, where we are going we dont need no roads')
})





/*
https://firebase.google.com/docs/firestore/query-data/listen?hl=en&authuser=0
import { doc, onSnapshot } from "firebase/firestore";

const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
  const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
  console.log(source, " data: ", doc.data());
});

https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0&hl=en
https://firebase.google.com/docs/firestore/query-data/queries?hl=en&authuser=0
const q = query(collection(db, "cities"), where("capital", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});

import { doc, getDoc} from "firebase/firestore"; 

class City {
    constructor (name, state, country ) {
        this.name = name;
        this.state = state;
        this.country = country;
    }
    toString() {
        return this.name + ', ' + this.state + ', ' + this.country;
    }
}

// Firestore data converter
const cityConverter = {
    toFirestore: (city) => {
        return {
            name: city.name,
            state: city.state,
            country: city.country
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new City(data.name, data.state, data.country);
    }
};

const ref = doc(db, "cities", "LA").withConverter(cityConverter);
const docSnap = await getDoc(ref);
if (docSnap.exists()) {
  // Convert to City object
  const city = docSnap.data();
  // Use a City instance method
  console.log(city.toString());
} else {
  console.log("No such document!");
}
*/