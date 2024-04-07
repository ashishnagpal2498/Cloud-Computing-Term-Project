import boto3
import json
from boto3.exceptions import Boto3Error

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
    create_rekognition_collection(collectionId)
    s3Images = s3.list_objects_v2(Bucket=s3BucketName, Prefix=s3FolderPrefix)
    print("S3-Images----->")
    print(s3Images)
    for obj in s3Images.get('Contents', []):
        object_key = obj['Key']
        print("Inside for loop with object_key --> ", object_key)
        
        if not object_key.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        try:
            response = index_user_images(s3BucketName,object_key,collectionId)
            print("Line 33 --> Response from Rekognition service")
            print(response)
            if response['ResponseMetadata']['HTTPStatusCode'] == 200:
                print("External" + response['FaceRecords'][0]['Face']['ExternalImageId'] )
                
        except Exception as e:
            print("Error in rekognition index creation")
            print(e)
            return build_response(500,{
                "message": "Internal Error in Lambda function"
            })
    return build_response(200,{
        "message": "success",
        "collectionName": collectionId
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
    response = userTable.get_item(
        Key={
            'username': username
        }
    )
    
    if 'Item' in response:  # Username exists
        item = response['Item']
            # If rekognitionCollectionId doesn't exist, add it
        userTable.update_item(
            Key={
                'username': username
            },
            UpdateExpression='SET rekognitionCollectionId = :val',
            ExpressionAttributeValues={
                ':val': username + "-collection"
            }
        )
    else:  # Username doesn't exist
        # Create a new entry
        userTable.put_item(
            Item={
                'rekognitionCollectionId': username + "-collection",
                'username': username
            }
        )


def create_rekognition_collection(collectionId):
    try:
        collectionExist = rekognition.describe_collection(CollectionId=collectionId)
        if collectionExist:
            print("Collection ARN --> ", collectionExist['CollectionARN'])
            return
    except rekognition.exceptions.ResourceNotFoundException:
        # Collection doesn't exist, create it
        response = rekognition.create_collection(CollectionId=collectionId)
        print('Collection ARN: ' + response['CollectionArn'])
    except Boto3Error as e:
        # Handle other errors
        print("Error:", e)

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