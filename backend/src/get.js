import AWS from "aws-sdk";
import uuidv1 from 'uuid/v1';

const dbg = (...args) => {
    console.log('get.main', ...args);
};

export async function main(event, context, callback) {
    dbg('enter', new Date());
    try {
        const kind = event.pathParameters.kind;
        const resultPayload = {
            result: kind,
            when: new Date()
        };
        if (kind === 'direct') {
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify(resultPayload)
            };
            console.log('Direct response', {response});
    	    callback(null, response);
        } else {
            // Write resultPayload into a buffer
            const resultPayloadString = JSON.stringify(resultPayload);
            const resultPayloadByteLength = Buffer.byteLength(resultPayloadString, 'utf8');
            const resultPayloadBuffer = Buffer.alloc(resultPayloadByteLength);
            resultPayloadBuffer.write(resultPayloadString, 0, resultPayloadByteLength, 'utf8');
            // Store resultPayloadBuffer into a bucket
            const tmpBucket = 'redirect-stored-replies';
            const key = `saved-${uuidv1()}`;
            const s3params = {
                Bucket: tmpBucket,
                Key: key,
                Body: resultPayloadBuffer
            };
            dbg({s3params});
            const s3 = new AWS.S3();
            try {
                await s3.putObject(s3params).promise();
            } catch (err) {
                throw new Error(`putObject({ Bucket: ${tmpBucket}, Key: ${key}, Body: buffer...}) FAILED:\n${err.toString()}`);
            }
            // Create redirect url
            const signedUrlParams = {
                Bucket: tmpBucket,
                Key: key,
                Expires: 300 // Link expires in 5 minutes
            };
            const url = s3.getSignedUrl('getObject', signedUrlParams);
            const redirectPayload = {
                location: url
            };
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify(redirectPayload)
            };
            console.log('Redirect response', {response});
    	    callback(null, response);
        }
    } catch (err) {
        const response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({status: false, error: err})
        };
        console.log('Failure response', {response}, {err});
    	callback(null, response);
    }
}
