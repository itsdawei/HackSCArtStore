//recursively allows for unique hashes
//done by
export function genHexString(len) {
    const hex = '0123456789ABCDEF';
    let output = '';
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    var x = output.slice(0,4);
    if (x == '0x00') {
        return genHexString(len)
    }
    else{
        return output
}}

// hashing the meta data of the NFT
// doesn't have to be a hash
