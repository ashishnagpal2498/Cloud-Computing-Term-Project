import boto3

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamoDBTableName = 'user-images'
dynamoDB = boto3.resource('dynamodb', region_name='us-east-1')
userTable = dynamoDB.Table(dynamoDBTableName)


def lambda_handler(event,context):
    print(event)
    # Change it to calling from springboot application
    s3Event = event['Records'][0]['s3']
    bucket = s3Event['bucket']['name']
    key = s3Event['object']['key']

    try:
        response = index_user_images(bucket,key)
        print("Response from Rekognition service")
        print(response)
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            faceId = response['FaceRecords'][0]['Face']['FaceId']
            name = "abc-new"
            addUser(faceId,name)
    except Exception as e:
        print("Error in rekognition index creation")
        print(e)
        raise e

def index_user_images(bucket,key):
    response = rekognition.index_faces(
        Image={
            'S3Object':
            {
                'Bucket': bucket,
                'Name': key
            }
        },
        CollectionId='user-collection'
    )
    return response

def addUser(faceId,name):
    userTable.put_item(
        Item={
            'rekognitionId': faceId,
            'name': name
        }
    )
