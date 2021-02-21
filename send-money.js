const myAddress = "rQqvCc8TMsFDqRQuZGe2ksSvdsZMmmJ3o";
const mySecret = "shZN3zqASwKQ8EwXCPmn9hMQc8H5j";
const myDest = "rpeUYxTdoGppcVnwFcepnr9TFf3bpqWhQX";

const RippleAPI = require("ripple-lib").RippleAPI;
const api = new RippleAPI({
    server: "wss://s.altnet.rippletest.net:51233", // Public rippled server hosted
    // by Ripple, Inc.
  });


function sendMoney(myAddress, mySeret, myDest) {
    api.on("error", (errorCode, errorMessage) => {
    console.log(errorCode + ": " + errorMessage);
  });
  api.on("connected", () => {
    console.log("connected");
  });
  api.on("disconnected", (code) => {
    // code - [close
    // code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent
    // by the server will be 1000 if this was normal closure
    console.log("disconnected, code:", code);
  });
  api
    .connect()
        .then(() => {
        enableRippling(myAddress, mySecret);
        })
    .then(() => {
      const preparedTx = api.prepareTransaction({
        TransactionType: "Payment",
        Account: myAddress,
        Amount: "2000000",
        Destination: myDest,
      });
      return preparedTx;
    })
    .then((pTx) => {
      const response = api.sign(pTx.txJSON, mySecret);
      const txID = response.id;
      console.log("Identifying hash:", txID);
      const txBlob = response.signedTransaction;
      console.log("Signed blob:", txBlob);
      return txBlob;
    })
    .then((txBlob) => {
      const result = api.submit(txBlob);
      console.log("Tentative result code:", result.resultCode);
      console.log("Tentative result message:", result.resultMessage);
    })
    .then(() => {
      return api.disconnect();
    })
    .catch(console.error);
}

async function enableRippling(genesisAddress, genesisSecret) {
  const preppedSettings = await api.prepareSettings(genesisAddress, {
    defaultRipple: true,
  })
  const submittedSettings = await api.submit(
    api.sign(preppedSettings.txJSON, genesisSecret).signedTransaction,
  )
  console.log('Submitted Set Default Ripple', submittedSettings)
}

sendMoney(myAddress, mySecret, myDest);
