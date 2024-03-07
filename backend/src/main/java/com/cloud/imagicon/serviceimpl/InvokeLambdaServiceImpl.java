package com.cloud.imagicon.serviceimpl;

import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.model.InvokeRequest;
import com.amazonaws.services.lambda.model.InvokeResult;

import com.cloud.imagicon.DTO.CollectionIndexesDTO;
import com.cloud.imagicon.DTO.HelperDTO;
import com.cloud.imagicon.DTO.SearchDTO;
import com.cloud.imagicon.DTO.UserSearchDTO;
import com.cloud.imagicon.service.InvokeLambdaService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InvokeLambdaServiceImpl implements InvokeLambdaService {


    @Autowired
    private AWSLambda awsLambda;

    @Autowired
    private ObjectMapper objectMapper;
   @Override
   public String createCollectionIndexes(String username, String bucketName, String folderPrefix) throws JsonProcessingException {
       CollectionIndexesDTO payload = new CollectionIndexesDTO(bucketName,folderPrefix,username);
       String payloadString = objectMapper.writeValueAsString(payload);

       InvokeRequest invokeRequest = new InvokeRequest()
               .withFunctionName("create_collection")
               .withPayload(payloadString);
       InvokeResult invokeResult = awsLambda.invoke(invokeRequest);

       if (invokeResult.getStatusCode() == 200) {
           System.out.println("Lambda Invoked Successful");
           return new String(invokeResult.getPayload().array());
       } else {
           throw new RuntimeException("Error invoking Lambda function. Status code: " + invokeResult.getStatusCode());
       }
   }

    @Override
    public UserSearchDTO searchUser(String bucketName, String folderPrefix, String collectionId) throws JsonProcessingException {
        SearchDTO payload = new SearchDTO(bucketName,folderPrefix,collectionId);
        String payloadString = objectMapper.writeValueAsString(payload);

        UserSearchDTO response = new UserSearchDTO();
        List<String> s3Urls = new ArrayList<>();
        InvokeRequest invokeRequest = new InvokeRequest()
                .withFunctionName("searchFace")
                .withPayload(payloadString);
        InvokeResult invokeResult = awsLambda.invoke(invokeRequest);

        if (invokeResult.getStatusCode() == 200) {
            System.out.println("Lambda Execution --> Search");
            try {
                HelperDTO.LambdaResponse lambdaResponse = objectMapper.readValue(invokeResult.getPayload().array(), HelperDTO.LambdaResponse.class);
                if (lambdaResponse.getBody() != null) {
                    HelperDTO.SearchResponse searchResponse = objectMapper.readValue(lambdaResponse.getBody(), HelperDTO.SearchResponse.class);
                    if (searchResponse.getFaces() != null) {
                        for (HelperDTO.Face face : searchResponse.getFaces()) {
                            String s3Url = constructS3Url(face.getExternalImageId());
                            s3Urls.add(s3Url);
                        }
                        System.out.println(s3Urls);
                       response.setImages(s3Urls);
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Error processing Lambda response.", e);
            }
        } else {
            throw new RuntimeException("Error invoking Lambda function. Status code: " + invokeResult.getStatusCode());
        }
        return response;
    }

    private String constructS3Url(String externalImageId) {
        String[] imageValues = externalImageId.split(":");
        StringBuilder str = new StringBuilder();
        for (int i = 1; i < imageValues.length ; i++) {
            str.append(imageValues[i]);
            if(i != imageValues.length -1 ){
                str.append("/");
            }
        }
        return "https://" + imageValues[0] + ".s3.amazonaws.com/" + str;
    }
}
