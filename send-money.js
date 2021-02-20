const RippleAPI = require('ripple-lib').RippleAPI;

const myAddress = 'rAzCYpaut8P4QkpvDW2vxMp9KUzUBNTc2';
const mySecret = 'sny5XGNH55tibrspn1VqMCCkLWCZk';

const api = new RippleAPI({
  server : 'wss://s.altnet.rippletest.net:51233' // Public rippled server hosted
                                                 // by Ripple, Inc.
});
api.on('error',
       (errorCode,
        errorMessage) => { console.log(errorCode + ': ' + errorMessage); });
api.on('connected', () => { console.log('connected'); });
api.on('disconnected', (code) => {
  // code - [close
  // code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent
  // by the server will be 1000 if this was normal closure
  console.log('disconnected, code:', code);
});
api.connect()
    .then(() => {
      api.sign({
        "Destination" : "r4FNkJtbKvCTjcE4UaeAtgpHGf8mAbeCoL",
        "TransactionType" : "Payment",
        "Amount" : "20000000",
        "Flags" : 2147483648,
        "Sequence" : 1,
        "LastLedgerSequence" : 6279611,
        "Account" : "rNQao3Z1irwRjKWSs8heL4a8WKLPKfLrXs",
        "Fee" : "12"
      });
    })
    .then(() => { return api.disconnect(); })
    .catch(console.error);
