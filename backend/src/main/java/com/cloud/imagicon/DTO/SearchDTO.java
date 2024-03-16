package com.cloud.imagicon.DTO;

public class SearchDTO {
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

    public String getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(String collectionId) {
        this.collectionId = collectionId;
    }

    private String bucketName;
    private String folderPrefix;

    private String collectionId;

    public SearchDTO(String bucketName, String folderPrefix, String collectionId) {
        this.bucketName = bucketName;
        this.folderPrefix = folderPrefix;
        this.collectionId = collectionId;
    }
}
