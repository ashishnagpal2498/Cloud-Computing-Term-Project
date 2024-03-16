package com.cloud.imagicon.DTO;

import java.util.List;

public class FriendsDTO {
    List<String> emailAddresses;

    public List<String> getEmailAddresses() {
        return emailAddresses;
    }

    public void setEmailAddresses(List<String> emailAddresses) {
        this.emailAddresses = emailAddresses;
    }

    public String getSnsTopicArn() {
        return snsTopicArn;
    }

    public void setSnsTopicArn(String snsTopicArn) {
        this.snsTopicArn = snsTopicArn;
    }

    public String getSnsTopicName() {
        return snsTopicName;
    }

    public void setSnsTopicName(String snsTopicName) {
        this.snsTopicName = snsTopicName;
    }

    String snsTopicArn;
    String snsTopicName;
}
