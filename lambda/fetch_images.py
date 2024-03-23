import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name='us-east-1')

def lambda_handler(event,context):
    print(event)

    bucketName = event['bucketName']
    objectKey = event['folderPrefix']
    collectionId = event['collectionId']
    
    image_bytes = s3.get_object(Bucket=bucketName,Key=objectKey)['Body'].read()

    try:
       faceMatchResponse = rekognition.search_faces_by_image(
           CollectionId=collectionId,
           Image={'Bytes':image_bytes}
       )
       responseBody = []
       for match in faceMatchResponse['FaceMatches']:
            print(match['Face']['FaceId'], match['Face']['Confidence'])
            print("abc")
            obj = {
                'faceId': match['Face']['FaceId'],
                'externalImageId': match['Face']['ExternalImageId']
            }
            responseBody.append(obj)
    except Exception as e:
        print("Error in rekognition image finding")
        print(e)
        return build_response(403, {'Message': "Person not found"})

    return build_response(200,{
        'faces': responseBody
        })

def build_response(statusCode, body=None):
    response = {
        'statusCode': statusCode,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
        }
    }
    if body is not None:
        response['body'] = json.dumps(body)
    print(response)
    return response
