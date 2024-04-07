package com.cloud.imagicon.controller;
import com.cloud.imagicon.DTO.FriendsDTO;
import com.cloud.imagicon.DTO.FriendsListDTO;
import com.cloud.imagicon.DTO.PublishToFriendsDTO;
import com.cloud.imagicon.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController

@RequestMapping("/friends-list")
public class FriendListController {

    @Autowired
    private FriendService snsService;

    @Value("${aws.region}")
    String awsRegion;

    @Value("${aws.accountId}")
    String awsAccountId;

    @Value("${frontendURL}")
    String frontendURL;

    @GetMapping("/")
    public ResponseEntity<List< String > > getFriendsList(){
        List<String> result = snsService.getFriendsList();
        System.out.println("FRONTENDURL --> " + frontendURL );
        return ResponseEntity.ok(result);

    }
    @PostMapping("/create")
    public ResponseEntity<String> createSubscriptions(@RequestBody FriendsDTO friends) {
        snsService.createSubscriptions(friends.getEmailAddresses(),false, friends.getSnsTopicName() );
        return ResponseEntity.ok("Topic and Subscription created successfully");
    }

    @PostMapping({"/add-friends","/resendConfirmation" })
    public ResponseEntity<String> addFriends(@RequestBody FriendsDTO friends) {
        String topicArn = "arn:aws:sns:" + awsRegion + ":" + awsAccountId + ":" + friends.getSnsTopicName();
        friends.setSnsTopicArn(topicArn);
        boolean response = snsService.createSubscriptions(friends.getEmailAddresses(), true, friends.getSnsTopicArn());
        if(response)
        { return ResponseEntity.ok("Friends Added successfully");}
        else {
            return ResponseEntity.internalServerError().body("Friends cannot be added");
        }
    }

    @DeleteMapping("/{topicName}")
    public String deleteTopicAndRemoveFromTable(@PathVariable String topicName) {
        // Delete the SNS topic
// Replace with your topic ARN

        // Remove the topic ARN from the DynamoDB table
        snsService.removeFriendList(topicName);

        return "Topic deleted successfully.";
    }


    @GetMapping("/get-friends/{topicName}")
    public ResponseEntity<?> getFriends(@PathVariable String topicName) {
        System.out.println("TopicName --> " + topicName);
        String topicArn = "arn:aws:sns:" + awsRegion + ":" + awsAccountId + ":" + topicName;
        System.out.println("Topic Arn ---> " +topicArn);
        List<FriendsListDTO> result = snsService.getFriends(topicArn);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/publishMessage")
    public ResponseEntity<String> publishMessage(@RequestBody PublishToFriendsDTO publishMessage) {
        try {

            String message = "Hello,\n\n" +
                    "Your friend has added photos to this link - http://" + frontendURL + "/view/" + publishMessage.getCollectionId() +
                    ". Use the link to get your photos from the album";
            System.out.println("FrontendURL ----> " + frontendURL);
            // Publish message to the SNS topic
            String result = snsService.publishPhotoURLToFriends(publishMessage.getSnsTopicName(), message);

            return ResponseEntity.ok("Message published successfully. MessageId: " + result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to publish message: " + e.getMessage());
        }
    }

    @DeleteMapping("/friend")
    public String deleteSubscription(@RequestBody FriendsListDTO friend) {
        snsService.removeFriend(friend.getSubscriptionArn());
        return "Subscription deleted successfully.";
    }

}