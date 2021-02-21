import {RippleAPI} from "ripple-lib"

export const api = new RippleAPI({
  server :
      "wss://s.altnet.rippletest.net:51233", // Public rippled server hosted
  // by Ripple, Inc.
});

export async function doPrepare(address, destination) {
  const preparedTx = await api.prepareTransaction({
    TransactionType : "Payment",
    Account : address,
    Amount : "2000000",
    Destination : destination,
  });
  return preparedTx;
}

export function signTransaction(pTx, mySecret) {
  const response = api.sign(pTx.txJSON, mySecret);
  const txID = response.id;
  console.log("Identifying hash:", txID);
  const txBlob = response.signedTransaction;
  console.log("Signed blob:", txBlob);
  return txBlob;
}

export async function doSubmit(txBlob) {
  const latestLedgerVersion = await api.getLedgerVersion();

  const result = await api.submit(txBlob);

  console.log("Tentative result code:", result.resultCode);
  console.log("Tentative result message:", result.resultMessage);

  // Return the earliest ledger index this transaction could appear in
  // as a result of this submission, which is the first one after the
  // validated ledger at time of submission.
  return latestLedgerVersion + 1;
}

export async function enableRippling(genesisAddress, genesisSecret) {
  const preppedSettings = await api.prepareSettings(genesisAddress, {
    defaultRipple : true,
  });
  const submittedSettings = await api.submit(
      api.sign(preppedSettings.txJSON, genesisSecret).signedTransaction);
  console.log("Submitted Set Default Ripple", submittedSettings);
}

export async function openTrustline(sourceAddress, sourceSecret, genesisAddress,
                             currency) {
  const preparedTrustline = await api.prepareTrustline(sourceAddress, {
    currency,
    counterparty : genesisAddress,
    limit : "100000",
    ripplingDisabled : false,
  });

  const signature =
      api.sign(preparedTrustline.txJSON, sourceSecret).signedTransaction;

  const submitResponse = await api.submit(signature);

  console.log("Trustline Submit Response", submitResponse);
}

export async function issueTokens(genesisAddress, genesisSecret, destinationAddress,
                           currency, value) {
  const preparedTokenIssuance = await api.preparePayment(genesisAddress, {
    source : {
      address : genesisAddress,
      maxAmount : {
        value : value,
        currency,
        counterparty : genesisAddress,
      },
    },
    destination : {
      address : destinationAddress,
      amount : {
        value : value,
        currency,
        counterparty : genesisAddress,
      },
    },
  });
  const issuanceResponse = await api.submit(
      api.sign(preparedTokenIssuance.txJSON, genesisSecret).signedTransaction);

  console.log("Issuance Submission Response", issuanceResponse);
}

/**
 * send a NRT from user A to user B
 */
export async function sendTokens(data) {
  const preparedTokenPayment = await api.preparePayment(data.sourceAddress, {
    source : {
      address : data.sourceAddress,
      maxAmount : {
        value : data.value,
        currency : data.currency,
        counterparty : data.genesisAddress,
      },
    },
    destination : {
      address : data.destinationAddress,
      amount : {
        value : data.value,
        currency : data.currency,
        counterparty : data.genesisAddress,
      },
    },
  });
  const tokenPaymentResponse =
      await api.submit(api.sign(preparedTokenPayment.txJSON, data.sourceSecret)
                           .signedTransaction);

  console.log("Token Payment Response", tokenPaymentResponse);
}

// sendMoney(ADDRESS, SECRET, DESTINATION, CURRENCY);
