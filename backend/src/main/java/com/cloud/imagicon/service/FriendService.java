package com.cloud.imagicon.service;

import com.cloud.imagicon.DTO.FriendsListDTO;

import java.util.List;

public interface FriendService {

    boolean createSubscriptions(List<String> emailAddresses, boolean addFriends, String snsTopicArnOrName);

    List<FriendsListDTO> getFriends(String topicArn);
}
