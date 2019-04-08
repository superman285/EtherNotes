
import {ethers} from "ethers";
import bip39 from "bip39";


function mnemonicToKey(mnemonic){
    return ethers.Wallet.fromMnemonic(mnemonic).privateKey;
}

function verify(keyAddr,accountAddr) {

    if (isMnemonic(keyAddr)) {
        keyAddr = mnemonicToKey(keyAddr);
    }

    if(ethers.utils.computeAddress(keyAddr) == accountAddr){
        return true;
    }else {
        return false;
    }
}

function isMnemonic(str) {
    return bip39.validateMnemonic(str);
}

function isKey(str) {
    return (ethers.utils.isHexString(str)&&str.length==66);
}

export {mnemonicToKey,verify,isMnemonic,isKey};




