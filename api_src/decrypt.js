import crypto from 'crypto'
export const vvdecrypt = (txt,secret) => {
    const decipher= crypto.createDecipheriv('sha512',secret,Buffer.from(txt, 'hex'));
    decipher.update(txt)
    return decipher.final()
}