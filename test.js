//import library
const express = require('express') 
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')

const app = express()
app.use(bodyparser.json())

const port = 8000

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tutorials', //ใส่ชื่อ data base
    port: 8889
  })
}


//path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async (req, res) => {
  const results = await conn.query('SELECT * FROM user') 
    res.json(results[0])
})



//output terminal
app.listen(port, async (req, res) => {
  await initMySQL()
  console.log('http server run at ' + port)
})