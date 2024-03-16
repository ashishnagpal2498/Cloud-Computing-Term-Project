package com.cloud.imagicon.controller;
import com.cloud.imagicon.DTO.FriendsDTO;
import com.cloud.imagicon.DTO.FriendsListDTO;
import com.cloud.imagicon.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/friends-list")
public class FriendListController {

    @Autowired
    private FriendService snsService;

    @Value("${aws.region}")
    String awsRegion;

    @Value("${aws.accountId}")
    String awsAccountId;

    @PostMapping("/create")
    public ResponseEntity<String> createSubscriptions(@RequestBody FriendsDTO friends) {
        snsService.createSubscriptions(friends.getEmailAddresses(),false, friends.getSnsTopicName() );
        return ResponseEntity.ok("Topic and Subscription created successfully");
    }

    @PostMapping("/add-friends")
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

    @GetMapping("/get-friends/{topicName}")
    public ResponseEntity<?> getFriends(@PathVariable String topicName) {
        System.out.println("TopicName --> " + topicName);
        String topicArn = "arn:aws:sns:" + awsRegion + ":" + awsAccountId + ":" + topicName;
        System.out.println("Topic Arn ---> " +topicArn);
        List<FriendsListDTO> result = snsService.getFriends(topicArn);
        return ResponseEntity.ok(result);
    }
}