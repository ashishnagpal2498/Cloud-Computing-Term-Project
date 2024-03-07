package com.cloud.imagicon.controller;

import com.cloud.imagicon.DTO.UserSearchDTO;
import com.cloud.imagicon.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/searchImage")
    public ResponseEntity<UserSearchDTO> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        UserSearchDTO s3UrlsResponse = imageService.searchUser(file);
        return ResponseEntity.ok(s3UrlsResponse);
    }
    @PostMapping("/uploadBulk")
    public ResponseEntity<String> uploadFiles(@RequestParam("files") MultipartFile[] files) throws IOException {

        String result = imageService.uploadImageFolder(files);
        return ResponseEntity.ok(result);
    }
}
