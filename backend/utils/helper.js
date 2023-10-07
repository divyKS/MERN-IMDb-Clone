const crypto = require('crypto');

// exports.sendError = (res, error, statusCode = 401) => (
//     res.status(statusCode).json({ error })
// )

exports.generateRandomBytes = ()=>{
    return new Promise((resolve, reject)=>{
        crypto.randomBytes(30, (error, buffer)=>{
            if(error) reject(error);
            // buffString is out required secured key
            const buffString = buffer.toString('hex');
            resolve(buffString);
        });
    });    
};