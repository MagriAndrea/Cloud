const bcrypt = require("bcrypt")
const salt = 10

const func = async (pass) => {
    console.log(await bcrypt.hash(pass, salt))
}

func("paolo")
