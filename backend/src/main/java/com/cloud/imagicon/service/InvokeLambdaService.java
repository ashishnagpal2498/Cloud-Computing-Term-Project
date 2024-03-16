package com.cloud.imagicon.service;

import com.cloud.imagicon.DTO.UserSearchDTO;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface InvokeLambdaService {

    String createCollectionIndexes(String username, String bucketName, String folderPrefix) throws JsonProcessingException;

    UserSearchDTO searchUser(String bucketName, String folderPrefix, String collectionId) throws JsonProcessingException;
}
