const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION 
});
const s3 = new AWS.S3();

const BUCKET = 'bluedog-nft-data'
const FILE = 'nft_data.json'

const uploadData = data => {
    const config = {
        Bucket: BUCKET, 
        Key: FILE,
        Body: JSON.stringify(data),
        ContentType: 'application/json',
        ACL: 'public-read'
    }
    
    s3.putObject(config, function(err, data) {
        if (err) {
            console.error(err)
            return
        }
    
        console.log("succesfully uploaded to s3")
    })
}

module.exports = {
    uploadData
}


