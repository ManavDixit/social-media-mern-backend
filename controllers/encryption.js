import dotenv from "dotenv";
dotenv.config();
import crypto from 'crypto';
const algorithm = "aes-256-cbc"; 
// const initVector ='5329866128019815';
const initVector=crypto.randomBytes(16);
const secretKey=process.env.SECRERT_KEY;
export const encrypt=(data)=>{
    try{
        const cipher = crypto.createCipheriv(algorithm, secretKey, initVector);
        let encryptedData = cipher.update(data, "utf-8", "hex");
        encryptedData+=cipher.final("hex");
        return encryptedData;
    }catch(error){
        console.log(error);
    }
}

export const decrypt=(encryptedData)=>{
    const decipher = crypto.createDecipheriv(algorithm, secretKey, initVector);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
}
