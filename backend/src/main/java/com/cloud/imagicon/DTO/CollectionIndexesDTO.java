package com.cloud.imagicon.DTO;

public class CollectionIndexesDTO {
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    private String username;

    public String getBucketName() {
        return bucketName;
    }

    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getFolderPrefix() {
        return folderPrefix;
    }

    public void setFolderPrefix(String folderPrefix) {
        this.folderPrefix = folderPrefix;
    }

    private String bucketName;
    private String folderPrefix;

    public CollectionIndexesDTO(String bucketName, String folderPrefix, String username){
        this.bucketName = bucketName;
        this.folderPrefix = folderPrefix;
        this.username = username;
    }
}
