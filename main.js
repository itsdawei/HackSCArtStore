import {RippleAPI} from "ripple-lib"
import { api } from "./send-money.js"
import * as util from "./send-money.js"

const ADDRESS = "rQqvCc8TMsFDqRQuZGe2ksSvdsZMmmJ3o";
const SECRET = "shZN3zqASwKQ8EwXCPmn9hMQc8H5j";
const DESTINATION = "rw5f4BS4rAiGJ3wvKfzsCQVF5ykufoAQDR";
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

// for testing
sendMoney(ADDRESS, SECRET, DESTINATION, CURRENCY);
