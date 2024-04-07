package com.cloud.imagicon.serviceimpl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
//S3 Bucket Imports

import com.cloud.imagicon.DTO.UserSearchDTO;
import com.cloud.imagicon.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private AmazonS3 amazonS3;

    @Autowired
    private  InvokeLambdaServiceImpl lambdaFunction;

    @Value("${s3BucketName}")
    String s3BucketName;

    private String imageUpload(MultipartFile file) throws IOException{
        String key = "search_user/" + "07March2024" + "-" + file.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());

        amazonS3.putObject(new PutObjectRequest(s3BucketName, key, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        String imageUrl = amazonS3.getUrl(s3BucketName, key).toString();
        System.out.println(imageUrl);
        return key;
    }
    @Override
    public UserSearchDTO searchUser(MultipartFile file) throws IOException {
        String imageKey = imageUpload(file);
        return lambdaFunction.searchUser(s3BucketName,imageKey,"ashishnagpal-collection");
    }

    @Override
    public String uploadImageFolder(MultipartFile[] files) throws IOException{
        try {
            for (MultipartFile file : files) {
                String key = "images/" + "ash/" + file.getOriginalFilename();

                amazonS3.putObject(new PutObjectRequest(s3BucketName, key, file.getInputStream(), null)
                        .withCannedAcl(CannedAccessControlList.PublicRead));
            }
            String collectionName = lambdaFunction.createCollectionIndexes("ashishnagpal",s3BucketName, "images/ash/");
            System.out.println(collectionName);
            return collectionName;
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to upload files.";
        }

    }
}
