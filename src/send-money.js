import {RippleAPI} from "ripple-lib"

export const api = new RippleAPI({
  server :
      "wss://s.altnet.rippletest.net:51233", // Public rippled server hosted
  // by Ripple, Inc.
});

async function doPrepare(address, destination, amount) {
  const preparedTx = await api.prepareTransaction({
    TransactionType : "Payment",
    Account : address,
    Amount : amount,
    Destination : destination,
  });
  return preparedTx;
}

function signTransaction(pTx, mySecret) {
  const response = api.sign(pTx.txJSON, mySecret);
  const txID = response.id;
  console.log("Identifying hash:", txID);
  const txBlob = response.signedTransaction;
  console.log("Signed blob:", txBlob);
  return txBlob;
}

async function doSubmit(txBlob) {
  const latestLedgerVersion = await api.getLedgerVersion();
  const result = await api.submit(txBlob);

  console.log("Tentative result code:", result.resultCode);
  console.log("Tentative result message:", result.resultMessage);

  // Return the earliest ledger index this transaction could appear in
  // as a result of this submission, which is the first one after the
  // validated ledger at time of submission.
  return latestLedgerVersion + 1;
}
//send xrp
export async function sendXrp(myAddress, mySecret, myDest, amount) {
  let pTx = await doPrepare(myAddress, myDest, amount);
  let txBlob = await signTransaction(pTx, mySecret);
  await doSubmit(txBlob);
}

export async function enableRippling(address, secret) {
  const preppedSettings = await api.prepareSettings(address, {
    defaultRipple : true,
  });
  const submittedSettings = await api.submit(
      api.sign(preppedSettings.txJSON, secret).signedTransaction);
  console.log("Submitted Set Default Ripple", submittedSettings);
}
//enable trust line secret of counterpart needed
export async function openTrustline(address, secret, target, currency) {
  const preparedTrustline = await api.prepareTrustline(address, {
    currency,
    counterparty : target,
    limit : "1000",
    ripplingDisabled : false,
  });

  const signature =
      api.sign(preparedTrustline.txJSON, secret).signedTransaction;

  const submitResponse = await api.submit(signature);

  console.log("Trustline Submit Response", submitResponse);
}
//give out initial token to artist
export async function issueTokens(srcAddress, srcSecret, destinationAddress,
                                  currency, value) {
  const preparedTokenIssuance = await api.preparePayment(srcAddress, {
    source : {
      address : srcAddress,
      maxAmount : {
        value : value,
        currency,
        counterparty : srcAddress,
      },
    },
    destination : {
      address : destinationAddress,
      amount : {
        value : value,
        currency,
        counterparty : srcAddress,
      },
    },
  });
  const issuanceResponse = await api.submit(
      api.sign(preparedTokenIssuance.txJSON, srcSecret).signedTransaction);

  console.log("Issuance Submission Response", issuanceResponse);
}

/**
 * send a NRT from user A to user B
 */
export async function sendTokens(srcAddress, srcSecret, dstAddress, mstAddress,
                                 currency, value) {
  const preparedTokenPayment = await api.preparePayment(srcAddress, {
    source : {
      address : srcAddress,
      maxAmount : {
        value,
        currency,
        counterparty : mstAddress,
      },
    },
    destination : {
      address : dstAddress,
      amount : {
        value : value,
        currency : currency,
        counterparty : mstAddress,
      },
    },
  });
  const tokenPaymentResponse = await api.submit(
      api.sign(preparedTokenPayment.txJSON, srcSecret).signedTransaction);
  console.log("Token Payment Response", tokenPaymentResponse);
}

// sendMoney(ADDRESS, SECRET, DESTINATION, CURRENCY);
