# Rest API ต่อกับ DB 
```js
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
  const results = await conn.query('SELECT * FROM user') //ชื่อต้องตรงกับ DB
    res.json(results[0])
})


// path  = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
  try {
    const userData = req.body                         //ชื่อต้องตรงกับ DB
    const results  = await conn.query('INSERT INTO user SET ?', userData)

    res.json({ 
      message: 'insert ok', 
      data: results[0] 
    })

  } catch (error) {
    console.error('Error message', error.message)
    res.status(500).json({
      message: 'somthing wrong'
    })
  }
})


//path = GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', async (req, res) => {
  try {
    let id = req.params.id
    const results = await conn.query('SELECT * FROM user WHERE id = ?' , id) //ชื่อต้องตรงกับ DB
    
    if (results[0].length == 0){
      throw {statusCode: 404, message: 'not found'}
    }
    res.json(results[0][0]) //จะได้ออกมาเป็น obj
    //res.json(results[0]) //จะได้ออกมาเป็น array

  } catch (error) {
    console.error('Error message', error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'somthing wrong' ,
      errorMassage: error.message
    })
  }
})


//path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', async (req, res) => {
  try {
    let id = req.params.id
    let updateUser = req.body
    const results  = await conn.query(
      'UPDATE user SET ? WHERE id = ?', 
      [updateUser , id]
    )

    res.json({ 
      message: 'update ok', 
      data: results[0] 
    })

  } catch (error) {
    console.error('Error message', error.message)
    res.status(500).json({
      message: 'somthing wrong'
    })
  }
})


// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', async (req, res) => {
 try {
    let id = req.params.id
    const results  = await conn.query('DELETE FROM user WHERE id = ?', id)

    res.json({ 
      message: 'delete ok', 
      data: results[0] 
    })

  } catch (error) {
    console.error('Error message', error.message)
    res.status(500).json({
      message: 'somthing wrong'
    })
  }
})


//output terminal
app.listen(port, async (req, res) => {
  await initMySQL()
  console.log('http server run at ' + port)
})
```