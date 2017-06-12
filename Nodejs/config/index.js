var configValues = require('./config');

module.exports = {
    
    getDbConnectionString: function() {
        return 'mongodb://cjapp:cjapp@ds147069.mlab.com:47069/cjapp';
    }
    
}