module.exports = function(app){
    const main = require('../src/mainController');
    app.get('/health', main.health);
    app.post('/transfer', main.transfer);
    app.get('/supply', main.supply);
};
