const Web3 = require("web3");
const Request = require('./../payloads/request');
const contract = require('./../config/contract');
const web3 = new Web3(new Web3.providers.HttpProvider("https://:01198b048c284987b7e5c0c3d6afc920@kovan.infura.io/v3/98af6aaba3db42f6bc233010855df8d8"));
const walletPrivateKey = process.env["WALLET_SECRET_KEY"];
web3.eth.accounts.wallet.add(walletPrivateKey);
const myWalletAddress = web3.eth.accounts.wallet[0].address;
const ethAddress = contract.contract.ethAddress;
const ethAbi = contract.contract.ethAbi;
const ethContract = new web3.eth.Contract(ethAbi, ethAddress);

exports.health = function(req, res){
    res.sendStatus(200);
};

exports.transfer = async function(req, res){
    const data = new Request(req.body);
    if(!data.verifyAll()) return res.sendStatus(400);
    await ethContract.methods.transfer(data.getPublicKey(), data.getAmount()).send({from: myWalletAddress, gas: 200000}, function (err, wres) {
        if (err) {
            console.log("An error occured", err);
            return;
        }
        res.status(200);
        return res.json({"Hash of the transaction: ":wres});
    })
    return res.sendStatus(404);
}

exports.supply = function(req, res){
    ethContract.methods.balanceOf(myWalletAddress).call().then((wres) => {
        res.status(200);
        return res.json({total_supply: wres/1e6});
    })
}
