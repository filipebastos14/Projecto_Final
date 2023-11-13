const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db = DbConnect.getDbConnectInstance();

const novoRegisto = async (req,res) => {
    const {user, email, pwd} = req.body

    // verifica se tem toda a info
    if (!user || !email || !pwd) return res.status(400).json({'Mensagem' : 'erro...'})

    // verifica se user já existe
    //const duplicado = // rota de pesquisa
    //if (duplicado) return res.sendStatus(409)
    try {
        // Encriptar pass
        const hashPass = await bcrypt.hash(pwd,10)
        const novoUtilizador = {'user': user,'email':email,'pass':hashPass}
        // novo resgisto
    } catch (err) {
        res.status(500).json({'mensagem' : err.message})
    }
}

module.exports = {novoRegisto}
