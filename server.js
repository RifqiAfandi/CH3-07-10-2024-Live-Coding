const fs = require('fs');
const express = require("express");
const port = 3000;

const app = express();
// const cars = JSON.parse(
//     fs.readFileSync(`${__dirname}/assets/data/cars.json`, "utf-8")
// );

// middleware untuk membaca json dari request body(client FE dll) ke kita
app.use(express.json());

const {product} = require('./models')

// Cek Koneksi
app.get("/", (req,res) => {
    res.status(200).json({
        "status" : "Succes",
        "message" : "application is running good . . . ."
    });
});
app.get('/jet', (req, res) => {
    res.status(200).json({
        "message" : "Ping Succesfully"
    });
});

// Get All
app.get('/api/v1/cars', async (req, res) => {
    // Select from
    try {
        const dataProduct = await product.findAll();
        
        res.status(201).json({
            "status": "success",
            "message": "Get data successfully",
            "isSuccess": true,
            "totalData": dataProduct.length,
            "data": {dataProduct},
        })
    }
    catch (error) {
        res.status(500).json({
            "status": "Failed",
            "message": `Get data Failed : ${error}`,
            "isSuccess": false,
            "data": null
        })
    }
});

// Insert
app.post('/api/v1/cars', (req, res) => {
    // insert into
    const newCar = req.body;
    cars.push(newCar);

    fs.writeFile(`${__dirname}/assets/data/cars.json`, JSON.stringify(cars), (err) => {
        res.status(201).json({
            status: "Success",
            message: "Success get car data",
            isSuccess: true,
            data: {
                cars: newCar
            },
        })
    });

    res.status(200).json({
        status: "Success",
        message: "Success get car data",
        isSuccess: true,
        data: {
            cars
        },
    });
});

// Get By Id
app.get('/api/v1/cars/:id', (req, res) => {
    // select * from fsw2 where id="1" or NAME="Yogi"
    const id = req.params.id

    // == maka tidak peduli tipe datanya, "10" == 10 => true
    // === jika 10 === "10" => false karena tipe data berbeda
    //apa bila ingin dijadikan number, kasih *1
    // const id = req.params.id *1 agar bisa digunakan bila menggunakan variable 

    const car = cars.find((i) => i.id == id);

    // salah satu basi error handling, 
    if(!car){
        res.status(404).json({
            status: "Failed",
            message: `Failed get car data this id : ${id}`,
            isSuccess: false,
            data: null,
        });
    // bisa tanpa else tapi ditambah return
    // if(!car){
    //     return res.status(404).json({
    //         status: "Failed",
    //         message: `Failed get car data this ${id}`,
    //         isSuccess: false,
    //         data: null,
    //     });

    }else{
        res.status(200).json({
            status: "Success",
            message: "Success get car data",
            isSuccess: true,
            data: {
                car,
            },
        });
    }
});

// Update By Id
app.patch('/api/v1/cars/:id', (req, res) => {
    const id = req.params.id *1;
    // UPDATE . . . FROM (table) WHERE id-req.param.id
    // Object destructuring
    const {name, year, type} = req.body

    // Mencari data by id nya
    const car = cars.find((i) => i.id === id);

    // mencari index
    const carIndex = cars.findIndex((car) => car.id === id);

    // Update sesuai request bodynya (client/frontend)
    // Object assign = menggunakan objek untuk spead operator
    // ... biar tidak duplicate
    cars[carIndex] = {...cars[carIndex], ...req.body};

    // Menampilkan data yang telah diupdate
    const newCar = cars.find((i) => i.id === id);

    // Masukkan/Rewrite data json dalam file
    fs.writeFile(`${__dirname}/assets/data/cars.json`, JSON.stringify(cars), (err) => {
        res.status(201).json({
            status: "Success",
            message: "Success get car data",
            isSuccess: true,
            data: {
                newCar
            }
        })
    });
});

// Delete By Id
app.delete('/api/v1/cars/:id', (req, res) => {
    const id = req.params.id *1;
    // UPDATE . . . FROM (table) WHERE id-req.param.id
    // Object destructuring
    const {name, year, type} = req.body


    // Mencari data by id nya
    const car = cars.find((i) => i.id === id);

    // mencari index
    const carIndex = cars.findIndex((car) => car.id === id);

    // Update sesuai request bodynya (client/frontend)
    // Object assign = menggunakan objek untuk spead operator
    // ... biar tidak duplicate
    cars[carIndex] = {...cars[carIndex], ...req.body};


    cars.splice(carIndex, 1) // Delete

    // Masukkan/Rewrite data json dalam file
    fs.writeFile(`${__dirname}/assets/data/cars.json`, JSON.stringify(cars), (err) => {
        res.status(201).json({
            status: "Success",
            message: "Success delete car data",
            isSuccess: true,
            data: null
        })
    });
});



// cara panggil respon.data.cars
// middleware / handler untuk url yang tidak dapat diakses karena memang tidak ada di aplikasi
// membuat middleware = our own middleware (.get .use)
app.use((req, res, next) => {
    // status code : 404 = untk not found (pengecekan data/url yang tidak ada)
    res.status(404).json({
        "status": "Failed",
        "massage": "API not exist !!!"
    })
});

app.listen("3000", () => {
    console.log("start apk dengan port 3000")
});