const BigNumber = require("bignumber.js");

const myAddress = "rQqvCc8TMsFDqRQuZGe2ksSvdsZMmmJ3o";
const mySecret = "shZN3zqASwKQ8EwXCPmn9hMQc8H5j";
const myDest = "rpeUYxTdoGppcVnwFcepnr9TFf3bpqWhQX";
const myCurrency = "EUR";

const RippleAPI = require("ripple-lib").RippleAPI;
const api = new RippleAPI({
  server: "wss://s.altnet.rippletest.net:51233", // Public rippled server hosted
  // by Ripple, Inc.
});

async function sendMoney(myAddress, mySeret, myDest) {
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
  
  try {
    await api.connect();
    await enableRippling(myAddress,mySecret);
    await openTrustline(myAddress, mySecret, myDest, myCurrency);
    await issueTokens(myAddress, mySecret, myDest, myCurrency, "1", 0.1);
    let pTx = await doPrepare(myAddress, myDest);
    let txBlob = await signTransaction(pTx, mySecret);
    await doSubmit(txBlob);
    await api.disconnect();
  } catch (e) {
    console.error(e);
  }
}

async function doPrepare(address, destination) {
  const preparedTx = await api.prepareTransaction({
    TransactionType: "Payment",
    Account: myAddress,
    Amount: "2000000",
    Destination: myDest,
  });
  return preparedTx;
}

function signTransaction(pTx, mySecret) {
  const response = api.sign(pTx.txJSON, mySecret);
  const txID = response.id;
  console.log("Identifying hash:", txID);
  const txBlob = response.signedTransaction;
  console.log("Signed blob:", txBlob);
  return txBlob
}

async function doSubmit(txBlob) {
  const latestLedgerVersion = await api.getLedgerVersion()

  const result = await api.submit(txBlob)

  console.log("Tentative result code:", result.resultCode)
  console.log("Tentative result message:", result.resultMessage)

  // Return the earliest ledger index this transaction could appear in
  // as a result of this submission, which is the first one after the
  // validated ledger at time of submission.
  return latestLedgerVersion + 1 
}

async function enableRippling(genesisAddress, genesisSecret) {
  const preppedSettings = await api.prepareSettings(genesisAddress, {
    defaultRipple: true,
  });
  const submittedSettings = await api.submit(
    api.sign(preppedSettings.txJSON, genesisSecret).signedTransaction
  );
  console.log("Submitted Set Default Ripple", submittedSettings);
}

async function openTrustline(
  sourceAddress,
  sourceSecret,
  genesisAddress,
  currency
) {
  const preparedTrustline = await api.prepareTrustline(sourceAddress, {
    currency,
    counterparty: genesisAddress,
    limit: "100000",
    ripplingDisabled: false,
  });

  const signature = api.sign(preparedTrustline.txJSON, sourceSecret)
    .signedTransaction;

  const submitResponse = await api.submit(signature);

  console.log("Trustline Submit Response", submitResponse);
}

async function issueTokens(
  genesisAddress,
  genesisSecret,
  destinationAddress,
  currency,
  value
) {
  const preparedTokenIssuance = await api.preparePayment(genesisAddress, {
    source: {
      address: genesisAddress,
      maxAmount: {
        value: value,
        currency,
        counterparty: genesisAddress,
      },
    },
    destination: {
      address: destinationAddress,
      amount: {
        value: value,
        currency,
        counterparty: genesisAddress,
      },
    },
  });
  const issuanceResponse = await api.submit(
    api.sign(preparedTokenIssuance.txJSON, genesisSecret).signedTransaction
  );

  console.log("Issuance Submission Response", issuanceResponse);
}

sendMoney(myAddress, mySecret, myDest);
