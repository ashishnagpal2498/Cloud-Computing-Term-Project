package com.cloud.imagicon.DTO;

public class PublishToFriendsDTO {
    public String getSnsTopicName() {
        return snsTopicName;
    }

    public void setSnsTopicName(String snsTopicName) {
        this.snsTopicName = snsTopicName;
    }

    public String getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(String collectionId) {
        this.collectionId = collectionId;
    }

    private String snsTopicName;
    private String collectionId;
}
