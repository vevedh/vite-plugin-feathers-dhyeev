import crypto from 'crypto'
import{ crypit } from 'crypit'
export const vvcrypt = async (txt,secret) => {
    //const hash = crypto.createHmac('sha512',secret)
    //hash.update(txt)
    return await crypit.hash.password.hash(txt);//hash.digest('hex')
}