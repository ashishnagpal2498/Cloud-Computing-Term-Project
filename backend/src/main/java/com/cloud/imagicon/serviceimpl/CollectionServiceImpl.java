package com.cloud.imagicon.serviceimpl;

import com.cloud.imagicon.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;

@Service
public class CollectionServiceImpl implements CollectionService {

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    @Value("${dynamoDBTableName}")
    private String dynamoDbTableName;
    public boolean checkCollection(String collectionName) {
        try {
            DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
            Table table = dynamoDB.getTable(dynamoDbTableName);
            System.out.println("CollectionName --> "+ collectionName);
            System.out.println("TableName  --> " + dynamoDbTableName);
            Item item = table.getItem("username", "ashishnagpal");
            System.out.println("DynamoDB Item Fetched ");
            System.out.println(item);
            return item != null && item.get("rekognitionCollectionId").equals(collectionName);// If the result contains an item, collection exists
        } catch (Exception e) {
            System.out.println("Error checking DynamoDB table: " + e.getMessage());
            return false;
        }
    }
}
