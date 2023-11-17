class dateModel { 
    static getDateModelInstance() {
        return new dateModel();
    }

    hojeOuAntes(data) {
        let hoje = new Date()
        let ano = hoje.getFullYear(), mes = hoje.getMonth()+1, dia = hoje.getDate();
        let hojeFormatado = ano + '-' + (mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;

        if (data <= hojeFormatado) {
            return true 
        }
        return false
    }

    converterFormato(data) {
        let dataNormal = new Date(data)
        let ano = dataNormal.getFullYear(), mes = dataNormal.getMonth()+1, dia = dataNormal.getDate();
        let dataFormatada = ano + '-' + (mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;
        return dataFormatada
    }
}

module.exports = dateModel


