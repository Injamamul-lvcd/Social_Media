const crypto=require('crypto')
const algorithm='aes-256-cbc'
const password=process.env.IV


//encription
const encrypt=(plaintext)=>{
    let cipher=crypto.createCipheriv(algorithm,Buffer.from(password),Buffer.from(iv))
    let crypted=Buffer.concat([cipher.update(Buffer.from(plaintext)),cipher.final()])
    return crypted
}

//decription
const decrypt=(hash)=>{
    const decipher=crypto.createDecipheriv(algorithm,Buffer.from(password),Buffer.from(iv))
    const decrypted=Buffer.concat([decipher.update(Buffer.from(hash,'base64')),decipher.final()])
    return decrypted.toString();
}
module.exports={
    encrypt:encrypt,
    decrypt:decrypt
}
