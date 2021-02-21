import { api } from "./send-money.js"
import * as util from "./send-money.js"
import { genHexString } from "./util.js"

const ADDRESS = "rQqvCc8TMsFDqRQuZGe2ksSvdsZMmmJ3o";
const SECRET = "shZN3zqASwKQ8EwXCPmn9hMQc8H5j";
const DESTINATION = "rw5f4BS4rAiGJ3wvKfzsCQVF5ykufoAQDR";
const DESTSECRET = "shwaybNQ7PV988ci5GMAN53Pgk4FL";
const CURRENCY = "EUR";

async function sendMoney(myAddress, mySecret, myDest, CURRENCY) {
  api.on("error",
         (errorCode,
          errorMessage) => { console.log(errorCode + ": " + errorMessage); });
  api.on("connected", () => { console.log("connected"); });
  api.on("disconnected", (code) => {
    // code - [close
    // code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent
    // by the server will be 1000 if this was normal closure
    console.log("disconnected, code:", code);
  });

  try {
    await api.connect();
    await util.enableRippling(myAddress, mySecret);
    await util.openTrustline(myAddress, mySecret, myDest, CURRENCY);
    await util.issueTokens(myAddress, mySecret, myDest, CURRENCY, "1", 0.1);
    let pTx = await util.doPrepare(myAddress, myDest);
    let txBlob = await util.signTransaction(pTx, mySecret);
    await util.doSubmit(txBlob);
    await api.disconnect();
  } catch (e) {
    console.error(e);
  }
}

// enable rippling init

async function createNFT(srcAddress, srcSecret, srcDest, NFTHash) {
    await api.connect();
    await util.enableRippling(srcAddress, srcSecret);
    await util.openTrustline(srcDest, DESTSECRET, srcAddress, NFTHash);
    await util.issueTokens(srcAddress, srcSecret, srcDest, NFTHash, "1");
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

// 

// for testing
// sendMoney(ADDRESS, SECRET, DESTINATION, CURRENCY);
// const curr = genHexString();
const curr = "015841551A748AD2C1F76FF6ECB0CCCD00000000";
createNFT(ADDRESS, SECRET, DESTINATION, curr);


// example -> manual add -> nft
// show there exists a NFT with the art
// 
