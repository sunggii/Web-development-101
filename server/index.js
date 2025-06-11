//import library
const express = require('express')
const app = express()

const bodyparser = require('body-parser')
app.use(bodyparser.json())

const port = 8000

// สำหรับเก็บ user
let users = []
let counter = 1

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

//path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', (req, res) => {
  const filterUsers =users.map(user => {
    return{
      id: user.id ,
      firstname: user.firstname ,
      lastname: user.lastname ,
      fullname: user.firstname + ' ' + user.lastname
    }
  })
  res.json(filterUsers)
})


// path  = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', (req, res) =>{
  //รับ user ที่ส่งเข้ามา
  let user = req.body
  user.id = counter
  counter += 1
  

  //เอาข้อมูลไปเก็บใน array
  users.push(user)
  res.json({
    message: 'add ok',
    user: user
  })

  //output terminal
  res.send(req.body)
})


//path = GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', (req, res) => {
  let id = req.params.id

  //หา index ที่จะลบ
  let selectedIndex = users.findIndex(user => user.id == id)

  //ลบ ตาม index ที่หาเจอ
  res.json(users[selectedIndex])
})


// path = PATCH /user/:id 
/*app.patch('/user/:id', (req, res) => {
  let id = req.params.id
  let updateUser = req.body

  //หา user จาก id ที่ส่งมา
  let selectedIndex = users.findIndex(user => user.id == id)

  //update ข้อมูล user (null || 'ค่าที่ update')
  if (updateUser.firstname) {
    users[selectedIndex].firstname = updateUser.firstname
  }
  
  if (users[selectedIndex].lastname) {
    users[selectedIndex].lastname = updateUser.lastname 
  }
  

  //ส่งข้อมูลที่ update เสร็จแล้วกลับไป
  res.json({
    message: 'update user complete!',
    data: {
      user: updateUser,
      indexUpdate: selectedIndex
    }
  }) 
})*/

//path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', (req, res) => {
  let id = req.params.id
  let updateUser = req.body

  //หา user จาก id ที่ส่งมา
  let selectedIndex = users.findIndex(user => user.id == id)

  //update ข้อมูล user (null || 'ค่าที่ update')
  users[selectedIndex].firstname = updateUser.firstname || updateUser.firstname 
  users[selectedIndex].lastname = updateUser.lastname  || updateUser.lastname 
  users[selectedIndex].age = updateUser.age || updateUser.age
  users[selectedIndex].gender = updateUser.gender || updateUser.gender 
 
  //ส่งข้อมูลที่ update เสร็จแล้วกลับไป
  res.json({
    message: 'update user complete!',
    data: {
      user: updateUser,
      indexUpdate: selectedIndex
    }
  }) 
})


// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', (req, res) => {
  let id = req.params.id

  //หา user จาก id ที่ส่งมา
  let selectedIndex = users.findIndex(user => user.id == id)

  //ลบ
  users.splice(selectedIndex, 1)

  res.json({
    message: 'delete complete!',
    indexDelete: selectedIndex
  })
})


//output terminal
app.listen(port, (req, res) => {
  console.log('http server run at ' + port)
})

