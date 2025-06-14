const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE' //defaul
let selectedId = ''

window.onload = async () => {
    // นำ parameter ทั้งหมดมาใส่ตัวแปร urlParams
    const urlParams = new URLSearchParams(window.location.search)
    // ดึง id ออกมาจาก parameter
    const id = urlParams.get('id')
    console.log('id', id)
    if (id) {
        // ถ้ามี id = เปลี่ยน mode และเก็บตัวแปร id เอาไว้
        mode = 'EDIT'
        selectedId = id

        //1. ดึงข้อมูลเก่าของ user ออกมา
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`)
            console.log('data', response.data)
            
            const user = response.data

            // นำข้อมูล user กลับใส่เข้าไปที่ input html
            let firstnameDom = document.querySelector('input[name=firstname]')
            let lastnameDom = document.querySelector('input[name=lastname]')
            let ageDom = document.querySelector('input[name=age]')
            let descriptionDom = document.querySelector('textarea[name=description]')

            firstnameDom.value = user.firstname
            lastnameDom.value = user.lastname
            ageDom.value = user.age
            descriptionDom.value = user.description

            let genderDoms = document.querySelectorAll('input[name=gender]') 
            let interestDoms = document.querySelectorAll('input[name=interest]') 

            for (let index = 0; index < genderDoms.length; index++) {
                if (genderDoms[index].value == user.gender) {
                    genderDoms[index].checked = true
                }
            }

            for (let index = 0; index < interestDoms.length; index++) {
                if (user.interrests.includes(interestDoms[index].value)) {
                    interestDoms[index].checked = true
                }
            }

        } catch (error) {
            console.log('error', error)
        }
    }
}

const validateData = (userData) => {
    let errors = []

    if (!userData.firstname) {
        errors.push('input firstname')
    }
    if (!userData.lastname) {
        errors.push('input lastname')
    }
    if (!userData.age) {
        errors.push('input age')
    }
    if (!userData.gender) {
        errors.push('input gender')
    }
    if (!userData.interrests) {
        errors.push('input interests')
    }
    if (!userData.description) {
        errors.push('input description')
    }

    return errors
}

const submitData = async () => {
    //เข้าถึงทุกฟิลด์
    let firstnameDom = document.querySelector('input[name=firstname]')
    let lastnameDom = document.querySelector('input[name=lastname]')
    let ageDom = document.querySelector('input[name=age]')

    let genderDom = document.querySelector('input[name=gender]:checked') || {}
    let interestDoms = document.querySelectorAll('input[name=interest]:checked') || {}

    let descriptionDom = document.querySelector('textarea[name=description]')

    let messageDom = document.getElementById('message')

    try {
        let interest = ''
        for (let index = 0; index < interestDoms.length; index++) {
            interest += interestDoms[index].value
            if (index != interestDoms.length - 1) { //จะใส่ , ถ้าไม่ใช่ตัวสุดท้าย
                interest += ' , '
            }
        }

        //สร้าง obj มาเก็บค่าเพื่อส่งให้ backend
        //สะกด key ดีๆ ต้องตรงกับ field Table
        let userData = {
            firstname: firstnameDom.value,
            lastname: lastnameDom.value,
            age: ageDom.value,
            gender: genderDom.value,
            description: descriptionDom.value,
            interrests: interest
        }
        console.log('submit data', userData)

        const errors = validateData(userData)
        if (errors.length > 0) {
            // มี error
            throw {
                message: 'missing data',
                errors: errors
            }
        }

        //axios ต่อหน้าบ้าน หลังบ้าน
        let message = 'submit success'

        if (mode == 'CREATE') {
            const response = await axios.post(`${BASE_URL}/users`, userData)
            console.log('response', response.data)
        } else {
            const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData)
            message = 'edit success'
            console.log('response', response.data)
        }

        messageDom.innerText = message 
        messageDom.className = 'message success'

    } catch (error) {
        console.log('error message:', error.message)
        console.log('error', error.errors)
        if (error.response) {
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }

        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'
        for (let index = 0; index < error.errors.length; index++) {
            htmlData += `<li>${error.errors[index]}</li>`
        }
        htmlData += '</ul>'
        htmlData += '</div>'

        messageDom.innerHTML = htmlData
        messageDom.className = 'message danger'
    }

}