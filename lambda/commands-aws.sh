aws rekognition list-faces --collection-id "ashishnagpal-collection"  

aws rekognition search-faces-by-image --image '{"S3Object":{"Bucket":"cloud-media-upload-1","Name":"images/profileimg.jpg"}}' \
--collection-id "user-collection"

aws rekognition delete-collection --collection-id "ashishnagpal-collection"

aws rekognition search-faces-by-image --image '{"S3Object":{"Bucket":"cloud-media-upload-1","Name":"images/profileimg.jpg"}}' \
--collection-id "ashishnagpal-collection"

aws s3api list-objects --bucket "cloud-media-upload-1" --query 'Contents[].{Key: Key, Size: Size}'

aws s3api get-object --bucket "cloud-media-upload-1" --key "images/ashish-random/ashish-solo-1.jpg" ashish-solo.jpg

S3 URL -->
https://cloud-media-upload-1.s3.amazonaws.com/images/ash/6ca0f076-a160-443e-b932-d697ffa03c84-monu-ashish.jpg
"cloud-media-upload-1:images:ash:6ca0f076-a160-443e-b932-d697ffa03c84-monu-ashish.jpg"