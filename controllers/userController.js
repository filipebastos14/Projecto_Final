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

    logout() {
        try {
            fs.writeFileSync(path,'{"email": null}')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = userModel


