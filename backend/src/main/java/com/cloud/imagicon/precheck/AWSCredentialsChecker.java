package com.cloud.imagicon.precheck;

import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Component
public class AWSCredentialsChecker implements ApplicationRunner {

//    @Value("${aws.accessKeyId}")
//    private String accessKey;
//
//    @Value("${aws.secretKey}")
//    private String secretKey;
//
//    @Value("${aws.sessionToken}")
//    private String sessionToken;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Perform the AWS credentials validation here
        try {
//            BasicSessionCredentials awsCredentials = new BasicSessionCredentials(accessKey, secretKey, sessionToken);
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(new DefaultAWSCredentialsProviderChain())
                    .build();

            s3Client.listBuckets();

            System.out.println("AWS credentials validation successful.");

        } catch (Exception e) {
            System.out.println("AWS credentials invalid/ expired");
        }
    }
}
