const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('on load')
    // Load user ทั้งหมดออกจาก API
    const response = await axios.get(`${BASE_URL}/users`)
    console.log(response.data)

    //นำ user ที่โหลดมาใส่กลับไปที่ html
    const userDOM = document.getElementById('user')
    let htmlData = '<div>'
    for (let index = 0; index < response.data.length; index++) {
        let user = response.data[index]
        htmlData += `<div>
        ${user.id} ${user.firstname} ${user.lastname}
        <a href='index.html?id=${user.id}'><button>Edit</button></a>
        <button class='delete' data-id='${user.id}'>Delete</button>
        </div>`

    }
    htmlData += '</div>'
    userDOM.innerHTML = htmlData

    //มีสิ่งนี้แล้ว button class='delete' 
    const deleteDom = document.getElementsByClassName('delete')

    for (let index = 0; index < deleteDom.length; index++) {
        deleteDom[index].addEventListener('click', async (event) => {
            // ดึง id  ออกมา
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData()
            } catch (error) {
                console.log('error', error)
            }
        })

    }
}