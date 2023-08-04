function Request(body){
    this.public_key = body.public_key;
    this.amount = parseInt(body.amount);
}

Request.prototype.getPublicKey = function () {
    return this.public_key;
}

Request.prototype.getAmount = function (){
    return this.amount;
}

Request.prototype.verifyAll = function () {
    if(this.verifyPublicKey() && this.verifyAmount()) return true;
    return false;
}

Request.prototype.verifyPublicKey = function () {
    if(this.getPublicKey().length !== 42) return false;
    return true;
}

Request.prototype.verifyAmount = function () {
    if(isNaN(this.getAmount()) || this.getAmount() < 0) return false;
    return true;
}

module.exports = Request;
