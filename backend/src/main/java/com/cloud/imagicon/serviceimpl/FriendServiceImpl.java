package com.cloud.imagicon.serviceimpl;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.model.*;
import com.cloud.imagicon.DTO.FriendsListDTO;
import com.cloud.imagicon.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private AmazonSNS amazonSNS;

    @Value("${aws.accountId}")
    private String accountId;

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    @Value("${dynamoDBTableName}")
    private String dynamoDbTableName;

    @Override
    public List<String> getFriendsList(){
        List<String> friendsList = new ArrayList<>();
        try {
            DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
            Table table = dynamoDB.getTable(dynamoDbTableName);
            System.out.println("TableName  --> " + dynamoDbTableName);
            Item item = table.getItem("username", "ashishnagpal");
            System.out.println("FriendsList for User");
            // DynamoDB setup and item retrieval

            if (item == null) {
                return friendsList;
            }

            // Get the friendsList attribute from the DynamoDB item
            Object friendsListObject = item.get("friendsList");
            if (friendsListObject instanceof List<?>) {
                // Iterate over each ARN in the list
                List<String> arns = (List<String>) friendsListObject;
                for (String arn : arns) {
                    // Extract the topic name from the ARN
                    String[] parts = arn.split(":");
                    String topicName = parts[parts.length - 1];
                    friendsList.add(topicName);
                }
            }
            return friendsList; // If the result contains an item, collection exists
        } catch (Exception e) {
            throw new RuntimeException("Error checking DynamoDB table: " + e.getMessage(), e);
        }
    }
    @Override
    public boolean createSubscriptions(List<String> emailAddresses, boolean addFriends, String snsTopicArnOrName) {
      try {
          // username + collectionName + Topic
          if(!addFriends)
          {
              snsTopicArnOrName = createTopic("ashishnagpal"+ snsTopicArnOrName);
              insertInTable(snsTopicArnOrName);
          }

            System.out.println("EmailAddresses - " + emailAddresses);
            System.out.println("Topic --- " + snsTopicArnOrName);
              for (String email : emailAddresses) {
              SubscribeRequest subscribeRequest = new SubscribeRequest()
                      .withTopicArn(snsTopicArnOrName)
                      .withProtocol("email")
                      .withEndpoint(email);

              amazonSNS.subscribe(subscribeRequest);
          }
      } catch (Exception e){
          System.out.println("Error in creating Subscriptions");
          return false;
      }
        return true;
    }

    @Override
    public void removeFriendList(String snsTopicName) {
        DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
        String snsTopicArn = getTopicArn(snsTopicName);
        DeleteTopicResult deleteTopicResult = amazonSNS.deleteTopic(new DeleteTopicRequest()
                .withTopicArn(snsTopicArn));
        List<String> friendsList = getFriendsList("ashishnagpal",dynamoDB, dynamoDbTableName);
        friendsList.remove(snsTopicArn);

        updateFriendsList("ashishnagpal", friendsList,dynamoDB,dynamoDbTableName);
    }

    @Override
    public List<FriendsListDTO> getFriends(String topicArn){
        List<FriendsListDTO> friends = new ArrayList<>();

        ListSubscriptionsByTopicRequest request = new ListSubscriptionsByTopicRequest()
                .withTopicArn(topicArn);

        ListSubscriptionsByTopicResult result = amazonSNS.listSubscriptionsByTopic(request);
// 404 not Found Handle --> Topic doesn't exist
        for (Subscription subscription : result.getSubscriptions()) {
            String emailAddress = subscription.getEndpoint();
            boolean isSubscribed = !subscription.getSubscriptionArn().equals("PendingConfirmation");

            friends.add(new FriendsListDTO(emailAddress, isSubscribed, subscription.getSubscriptionArn()));
        }

        return friends;
    }

    @Override
    public void removeFriend(String subscriptionArn) {
        UnsubscribeRequest unsubscribeRequest = new UnsubscribeRequest()
                .withSubscriptionArn(subscriptionArn);
        amazonSNS.unsubscribe(unsubscribeRequest);
    }

    @Override
    public String publishPhotoURLToFriends(String snsTopicName, String message) {
            String topicArn = getTopicArn(snsTopicName);

            PublishRequest request = new PublishRequest()
                    .withTopicArn(topicArn)
                    .withMessage(message);

            return amazonSNS.publish(request).getMessageId();
        }

        private String getTopicArn(String snsTopicName) {
                  return "arn:aws:sns:us-east-1:" + accountId + ":" + snsTopicName;
        }
    private String createTopic(String topicName) {
        CreateTopicRequest createTopicRequest = new CreateTopicRequest(topicName);
        CreateTopicResult createTopicResult = amazonSNS.createTopic(createTopicRequest);
        return createTopicResult.getTopicArn();
    }

    private void insertInTable(String snsTopicArn){
        DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);

        List<String> friendsList = getFriendsList("ashishnagpal", dynamoDB, dynamoDbTableName);

        friendsList.add(snsTopicArn);

        updateFriendsList("ashishnagpal", friendsList, dynamoDB, dynamoDbTableName);
    }

    private List<String> getFriendsList(String username, DynamoDB dynamoDB, String tableName) {
        Item item = dynamoDB.getTable(tableName).getItem(new PrimaryKey("username", username));
        if (item != null && item.getList("friendsList") != null) {
            return new ArrayList<>(item.getList("friendsList"));
        } else {
            return new ArrayList<>();
        }
    }

    private void updateFriendsList(String username, List<String> friendsList, DynamoDB dynamoDB, String tableName) {
        Map<String, Object> valueMap = new HashMap<>();
        valueMap.put(":val", friendsList);

        UpdateItemSpec updateItemSpec = new UpdateItemSpec()
                .withPrimaryKey("username", username)
                .withUpdateExpression("SET friendsList = :val")
                .withValueMap(valueMap)
                .withReturnValues(ReturnValue.ALL_NEW);

        dynamoDB.getTable(tableName).updateItem(updateItemSpec);
    }
}

