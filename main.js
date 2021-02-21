import { api } from "./send-money.js"
import * as util from "./send-money.js"
import * as dbtools from "./add-user.js"
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
    await util.issueTokens(mstAddress, MSTSECRET, SRCADDRESS, NFTHash, "1");
    await api.disconnect();
}

function addUID2DB(username, password, email, xrpAddress) {
    dbtools.addUsers(username, xrpAddress, password, email, true);
}

function changeOwnship(hash, newOwner) {
    dbtools.changeOwnership(hash, newOwner);
}

// exchange xrp for token
async function processBuy(srcAddress, srcSecret, dstAddress, mstAddress, currency){
    await api.connect();
    // await util.sendXrp(srcAddress, dstAddress);
    // TODO check if transaction is succesful by checking result code
    await util.openTrustline(dstAddress, DSTSECRET, mstAddress, currency);
    await util.sendTokens(srcAddress, srcSecret, dstAddress, mstAddress, currency, "1");
    await api.disconnect();
}

// for testing
// sendMoney(ADDRESS, SECRET, DESTINATION, CURRENCY);
const curr = genHexString(40);
// const curr = "015841551A748AD2C1F76FF6ECB0CCCD00000000";
// createNFT(SRCADDRESS, SRCSECRET, MSTADDRESS, curr);
// processBuy(SRCADDRESS, SRCSECRET, DSTADDRESS, MSTADDRESS, curr);
