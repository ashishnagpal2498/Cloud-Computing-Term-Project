package com.cloud.imagicon.serviceimpl;

import com.cloud.imagicon.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;

@Service
public class CollectionServiceImpl implements CollectionService {

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    private final String dynamoDbTableName = "user-images";
    public boolean checkCollection(String collectionName) {
        try {
            DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
            Table table = dynamoDB.getTable(dynamoDbTableName);
            System.out.println("CollectionName --> "+ collectionName);
            System.out.println("TableName  --> " + dynamoDbTableName);
            Item item = table.getItem("rekognitionCollectionId", collectionName);

            return item != null; // If the result contains an item, collection exists
        } catch (Exception e) {
            throw new RuntimeException("Error checking DynamoDB table: " + e.getMessage(), e);
        }
    }
}
