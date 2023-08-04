import axios from 'axios';

async function CoinGecko(){
    const res =  await axios
        .request({
            method:'GET',
            url: `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur`,
        });
    if(res.status !== 200){
        return -1;
    }else{
        return res.data;
    }
}

export default CoinGecko;
