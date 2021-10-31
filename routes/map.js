const { response } = require('express')
const express = require('express')
const router = express.Router()

const pool = require('../configs/connectDB')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/create', (req, res) => {
    res.render('create-vinmart', { data: { error: false } })
})

let checkRequireFields = (inputData) => {
    const arr = ['toaDo', 'name', 'address', 'open', 'close']
    let isValid = true
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false
            element = arr[i]
            break
        }
    }

    return {
        isValid,
        element
    }
}

router.post('/create-vinmart', async (req, res) => {
    const { toaDo, name, address, open, close } = req.body
    // console.log(req.body);
    try {
        let checkObj = checkRequireFields(req.body)
        // console.log(checkObj);
        if (checkObj.isValid === false) {
            let message = `Bạn không được để trống ${checkObj.element}`
            // res.json({ data: { message } })
            return res.render('create-vinmart', {
                data: {
                    message,
                    toaDo, name, address, open, close,
                }
            })
        }

        let data = await pool.query('INSERT INTO vinmart (name, address, open, close, geom) values ($1, $2, $3, $4, $5)', [name, address, open, close, `POINT(${toaDo})`])

        // res.json({ data, message: 'create successfully' })

        res.redirect('/')

    } catch (error) {
        console.log(error);
    }
})

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    try {
        const pointVinmart = await pool.query('Select * from vinmart where id = $1', [id])
        // res.json({ pointVinmart })
        if (pointVinmart.rows.length === 0) {
            return res.render('edit', { data: { messageVinmart: 'Địa điểm không tồn tại' } })
        } else {
            return res.render('edit', { data: pointVinmart.rows[0] })
            // return res.json({ data: pointVinmart.rows[0] })
        }
    } catch (error) {
        console.log(error);
    }
})

let checkRequireFieldsUpdate = (inputData) => {
    const arr = ['name', 'address', 'open', 'close']
    let isValid = true
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false
            element = arr[i]
            break
        }
    }

    return {
        isValid,
        element
    }
}

router.post('/update/:id', async (req, res) => {
    const { name, address, open, close } = req.body
    const { id } = req.params

    try {
        let checkObj = checkRequireFieldsUpdate(req.body)
        // console.log(checkObj);
        if (checkObj.isValid === false) {
            let message = `Bạn không được để trống ${checkObj.element}`
            // res.json({ data: { message } })
            return res.render('edit', {
                data: {
                    message,
                    name, address, open, close, id
                }
            })
        }

        await pool.query('Update vinmart Set name = $1, address = $2, open = $3, close = $4 Where id = $5', [name, address, open, close, id])

        res.redirect('/')

    } catch (error) {
        console.log(error);
    }
})

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        const pointVinmart = await pool.query('Select * from vinmart where id = $1', [id])
        // res.json({ pointVinmart })
        if (pointVinmart.rows.length === 0) {
            return res.json({ message: 'Địa điểm không tồn tại' })
        }

        await pool.query('Delete from vinmart where id = $1', [id])
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
})

router.get('/test', async (req, res) => {
    const data = await pool.query('Select * from vinmart')

    res.json({ data: data.rows })
})

module.exports = router