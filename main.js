import { api } from "./send-money.js"
import * as util from "./send-money.js"
import { genHexString } from "./util.js"

// master address and secret (us)
const MSTADDRESS = "rQqvCc8TMsFDqRQuZGe2ksSvdsZMmmJ3o";
const MSTSECRET = "shZN3zqASwKQ8EwXCPmn9hMQc8H5j";

// source address and secret (user A)
const SRCADDRESS = "rw5f4BS4rAiGJ3wvKfzsCQVF5ykufoAQDR";
const SRCSECRET = "shwaybNQ7PV988ci5GMAN53Pgk4FL";

// destination address and secret (user B)
const DSTADDRESS = "rL7vcmBnJeCY8ze5EjJRprp55LeUhWvuZP";
const DSTSECRET = "shtWmqEDeATDas9nYcAYTwYELujWG";

async function createNFT(srcAddress, srcSecret, mstAddress, NFTHash) {
    await api.connect();
    await util.enableRippling(srcAddress, srcSecret);
    await util.openTrustline(srcAddress, srcSecret, mstAddress, NFTHash);
    await util.issueTokens(srcAddress, srcSecret, mstAddress, NFTHash, "1");
    await api.disconnect();
}

function addUID2DB(username, password, email, xrpAddress){

}

// exchange xrp for token
async function processBuy(srcAddress, destAddress){
    await api.connect();
    util.sendXrp(srcAddress, destAddress);
    // TODO check if transaction is succesful by checking result code
    util.sendTokens(srcAddress, destAddress);
    await api.disconnect();
}

// for testing
// sendMoney(ADDRESS, SECRET, DESTINATION, CURRENCY);
// const curr = genHexString();
const curr = "015841551A748AD2C1F76FF6ECB0CCCD00000000";
createNFT(SRCADDRESS, SRCSECRET, MSTADDRESS, curr);


// example -> manual add -> nft
// show there exists a NFT with the art
// 
