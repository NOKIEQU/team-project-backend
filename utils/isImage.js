const isBase64 = require('is-base64');
// This is still not safe 
// This code will check for the height and width but there still might be a bad script

async function isImage(base64String) {
    return await isBase64(base64String, {mimeRequired: true})
}

module.exports = { isImage }