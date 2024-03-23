package com.cloud.imagicon.service;

import com.cloud.imagicon.DTO.FriendsListDTO;

import java.util.List;

public interface FriendService {

    boolean createSubscriptions(List<String> emailAddresses, boolean addFriends, String snsTopicArnOrName);

    List<FriendsListDTO> getFriends(String topicArn);

    List<String> getFriendsList();

    String publishPhotoURLToFriends(String snsTopicName, String message);

    void removeFriendList(String snsTopicName);

    void removeFriend(String subscriptionArn);
}
