package com.cloud.imagicon.DTO;

public class FriendsListDTO {

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public boolean isSubscribed() {
        return isSubscribed;
    }

    public void setSubscribed(boolean subscribed) {
        isSubscribed = subscribed;
    }

    public FriendsListDTO(String email, boolean isSubscribed, String subscriptionArn){
        this.emailAddress = email;
        this.isSubscribed = isSubscribed;
        this.subscriptionArn = subscriptionArn;
    }
    private String emailAddress;
    private boolean isSubscribed;

    public String getSubscriptionArn() {
        return subscriptionArn;
    }

    public void setSubscriptionArn(String subscriptionArn) {
        this.subscriptionArn = subscriptionArn;
    }

    private String subscriptionArn;
}
