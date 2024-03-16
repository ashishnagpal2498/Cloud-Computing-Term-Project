package com.cloud.imagicon.serviceimpl;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.model.*;
import com.cloud.imagicon.DTO.FriendsListDTO;
import com.cloud.imagicon.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private AmazonSNS amazonSNS;

    @Override
    public boolean createSubscriptions(List<String> emailAddresses, boolean addFriends, String snsTopicArnOrName) {
      try {
          // username + collectionName + Topic
          if(!addFriends)
          {
              snsTopicArnOrName = createTopic("ashishnagpal"+ snsTopicArnOrName + "Topic");
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
    public List<FriendsListDTO> getFriends(String topicArn){
        List<FriendsListDTO> friends = new ArrayList<>();

        ListSubscriptionsByTopicRequest request = new ListSubscriptionsByTopicRequest()
                .withTopicArn(topicArn);

        ListSubscriptionsByTopicResult result = amazonSNS.listSubscriptionsByTopic(request);

        for (Subscription subscription : result.getSubscriptions()) {
            String emailAddress = subscription.getEndpoint();
            boolean isSubscribed = !subscription.getSubscriptionArn().equals("PendingConfirmation");
            friends.add(new FriendsListDTO(emailAddress, isSubscribed));
        }

        return friends;
    }
    private String createTopic(String topicName) {
        CreateTopicRequest createTopicRequest = new CreateTopicRequest(topicName);
        CreateTopicResult createTopicResult = amazonSNS.createTopic(createTopicRequest);
        return createTopicResult.getTopicArn();
    }
}

