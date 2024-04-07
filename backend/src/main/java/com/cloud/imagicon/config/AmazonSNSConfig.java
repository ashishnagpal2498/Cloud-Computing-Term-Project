package com.cloud.imagicon.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmazonSNSConfig {

    @Value("${aws.region}")
    private String awsRegion;

//    @Value("${aws.accessKeyId}")
//    private String accessKey;
//
//    @Value("${aws.secretKey}")
//    private String secretKey;
//
//    @Value("${aws.sessionToken}")
//    private String sessionToken;

    @Bean
    public AmazonSNS amazonSNS() {
//        BasicSessionCredentials awsCreds = new BasicSessionCredentials(accessKey, secretKey, sessionToken);
        return AmazonSNSClientBuilder.standard()
                .withCredentials(new DefaultAWSCredentialsProviderChain())
                .withRegion(awsRegion)
                .build();
    }
}

