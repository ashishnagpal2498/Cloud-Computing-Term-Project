package com.cloud.imagicon.service;

import com.cloud.imagicon.DTO.UserSearchDTO;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface ImageService {
    UserSearchDTO searchUser(MultipartFile file) throws IOException;

    String uploadImageFolder(MultipartFile[] files) throws IOException;
}