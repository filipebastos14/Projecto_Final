// const user = {
//     user : require('../models/user.json'),
//     setUser : function(data) {this.user = data}
// }

const fs = require('fs');
const path = './models/user.json';

// 

class userModel { 
    static getUserInstance() {
        return new userModel();
    }

    guardarUser(data) {
        try {
            // Ensure that the directory exists
            const dir = path.substring(0, path.lastIndexOf('/'));
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
    
            // Write the file
            fs.writeFileSync(path, data);
            console.log(`Data saved to ${path}`);
        } catch (error) {
            console.error(error);
        }
    }

    ordenarMovimentos(user) {
        let movimentos = user['movimentos']
        let tamanho = movimentos.length

        for (let x = 1; x < tamanho; x++) {
            if (movimentos[x-1]['data'] < movimentos[x]['data']) {
                for (let y = x; y > 0; y--) {
                    let a = movimentos[y-1]
                    let b = movimentos[y]
    
                    if (a['data'] < b['data']) {
                        movimentos[y-1] = b
                        movimentos[y] = a
                    }
                }
            } 
        }
        this.guardarUser(JSON.stringify(user,null,2))
    }

    adicionarMovimento(movimento) {
        let data = require('../models/user.json')
        let categorias = require('../models/categorias.json')
        let categoria = categorias['categorias']

        console.log(movimento['categoria']);

        console.log("Categoria eheheh:  " + categoria[movimento['categoria']]);

        movimento['categoria'] = categoria[movimento['categoria']]

        data["movimentos"].push(movimento)

        let hoje = new Date()
        let ano = hoje.getFullYear(), mes = hoje.getMonth()+1, dia = hoje.getDate();
        let hojeFormatado = ano + '-' + (mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;

        if (movimento['data'] <= hojeFormatado) {
            console.log('É antes de amanhã');
            if (movimento['tipo'] == 1) {
                data['saldo'] -= movimento['valor']
            } else {
                data['saldo'] += movimento['valor']
            }
            
        }

        this.ordenarMovimentos(data)
    }

    logout() {
        try {
            fs.writeFileSync(path,'{"email": null}')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = userModel


