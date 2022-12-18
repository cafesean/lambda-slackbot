import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


export async function gpt(url:string, data:any, options:any) {
    return new Promise(async (resolve, reject) => {
        await axios
            .post(url, data, options)
            .then(response => {
                resolve(response.data.choices[0].text);
                // console.log("data: ", response.data.choices[0].text);
            })
            .catch(error => {
                reject(error);
            });
    });
}