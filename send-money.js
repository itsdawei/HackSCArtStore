const myAddress = "rQqvCc8TMsFDqRQuZGe2ksSvdsZMmmJ3o";
const mySecret = "shZN3zqASwKQ8EwXCPmn9hMQc8H5j";
const myDest = "rpeUYxTdoGppcVnwFcepnr9TFf3bpqWhQX";

const RippleAPI = require("ripple-lib").RippleAPI;

const api = new RippleAPI({
  server: "wss://s.altnet.rippletest.net:51233", // Public rippled server hosted
  // by Ripple, Inc.
});
api.on("error", (errorCode, errorMessage) => {
  console.log(errorCode + ": " + errorMessage);
});
api.on("connected", () => {
  console.log("connected");
});
api.on("disconnected", (code) => {
  // code - [close
  // code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by
  // the server will be 1000 if this was normal closure
  console.log("disconnected, code:", code);
});
api
  .connect()
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
    return txBlob
  })
  .then((txBlob) => {
    const result = api.submit(txBlob)
    console.log("Tentative result code:", result.resultCode)
    console.log("Tentative result message:", result.resultMessage)

  })
  .then(() => {
    return api.disconnect();
  })
  .catch(console.error);

// ripple = require('ripple-lib')
// api = new ripple.RippleAPI({server:
// 'wss://s.altnet.rippletest.net:51233'}) api.connect()

// // Continuing after connecting to the API
// async function doPrepare() {
//   const sender = myAddress;
//   const preparedTx = await api.prepareTransaction({
//     "TransactionType": "Payment",
//     "Account": sender,
//     "Amount": api.xrpToDrops("22"), // Same as "Amount": "22000000"
//     "Destination": myDest
//   }, {
//     // Expire this transaction if it doesn't execute within ~5
//     minutes: "maxLedgerVersionOffset": 75
//   })
//   const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
//   console.log("Prepared transaction instructions:",
//   preparedTx.txJSON) console.log("Transaction cost:",
//   preparedTx.instructions.fee, "XRP") console.log("Transaction
//   expires after ledger:", maxLedgerVersion) return
//   preparedTx.txJSON
// }
// txJSON = JSON.stringify(doPrepare())

// // Continuing from the previous step...
// const response = api.sign(txJSON, "ssTZfx5m1UjUhGH6XYShW9XJD979P")
// const txID = response.id
// console.log("Identifying hash:", txID)
// const txBlob = response.signedTransaction
// console.log("Signed blob:", txBlob)

// // use txBlob from the previous example
// async function doSubmit(txBlob) {
//   const latestLedgerVersion = await api.getLedgerVersion()

//   const result = await api.submit(txBlob)

//   console.log("Tentative result code:", result.resultCode)
//   console.log("Tentative result message:", result.resultMessage)

//   // Return the earliest ledger index this transaction could appear
//   in
//   // as a result of this submission, which is the first one after
//   the
//   // validated ledger at time of submission.
//   return latestLedgerVersion + 1
// }
// const earliestLedgerVersion = doSubmit(txBlob)

// api.on('error',
//        (errorCode,
//         errorMessage) => { console.log(errorCode + ': ' +
//         errorMessage); });
// api.on('connected', () => { console.log('connected'); });
// api.on('disconnected', (code) => {
//   // code - [close
//   //
//   code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent)
//   sent
//   // by the server will be 1000 if this was normal closure
//   console.log('disconnected, code:', code);
// });
