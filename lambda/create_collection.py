import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamoDBTableName = 'user-images'
dynamoDB = boto3.resource('dynamodb', region_name='us-east-1')
userTable = dynamoDB.Table(dynamoDBTableName)

# This function will be called by Springboot application -->S3 bucket Name and Prefix
def lambda_handler(event,context):
    print(event)
    # Change it to calling from springboot application
    s3BucketName = event['bucketName']
    s3FolderPrefix = event['folderPrefix']
    username = event['username']

    addUser(username)
    collectionId = username + '-collection'
    # create_rekognition_collection(collectionId)
    s3Images = s3.list_objects_v2(Bucket=s3BucketName, Prefix=s3FolderPrefix)

    for obj in s3Images.get('Contents', []):
        object_key = obj['Key']
        
        if not object_key.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        try:
            response = index_user_images(s3BucketName,object_key,collectionId)
            print("Line 33 --> Response from Rekognition service")
            print(response)
            if response['ResponseMetadata']['HTTPStatusCode'] == 200:
                print("External" + response['FaceRecords'][0]['Face']['ExternalImageId'] )
            
            return build_response(200,{
                "message": "success",
            })
                
        except Exception as e:
            print("Error in rekognition index creation")
            print(e)
            return build_response(500,{
                "message": "Internal Error in Lambda function"
            })

def index_user_images(bucket,key,collectionId):
    response = rekognition.index_faces(
        Image={
            'S3Object':
            {
                'Bucket': bucket,
                'Name': key
            }
        },
        CollectionId=collectionId,
        ExternalImageId= bucket + ":" + ':'.join(key.split('/'))
    )
    return response

def addUser(username):
    userTable.put_item(
        Item={
            'rekognitionCollectionId': username + "-collection",
            'username': username
        }
    )

def create_rekognition_collection(collectionId):
    response = rekognition.create_collection(CollectionId=collectionId)
    print('Collection ARN: ' + response['CollectionArn'])

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
    return response