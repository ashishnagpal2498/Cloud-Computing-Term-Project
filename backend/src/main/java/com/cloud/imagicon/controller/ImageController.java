package com.cloud.imagicon.controller;

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

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return imageService.uploadImage(file);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<String> getImageUrlById(@PathVariable Long id) {
        String imageUrl = imageService.getImageUrlById(id);
        return ResponseEntity.ok(imageUrl);
    }
}
