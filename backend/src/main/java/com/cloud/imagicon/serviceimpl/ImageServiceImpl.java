package com.cloud.imagicon.serviceimpl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
//import com.cloud.imagicon.entity.Image;
import com.cloud.imagicon.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private AmazonS3 amazonS3;

//    @Autowired
//    private ImageRepository imageRepository;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        String key = "images/" + UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

        amazonS3.putObject(new PutObjectRequest("cloud-media-upload-1", key, file.getInputStream(), null)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        String imageUrl = amazonS3.getUrl("cloud-media-upload-1", key).toString();

//        Image image = new Image();
//        image.setUrl(imageUrl);
//        imageRepository.save(image);

        return "Image uploaded successfully! URL: " + imageUrl;
    }

    @Override
    public String getImageUrlById(Long id) {
        // Fetch image URL from repository based on ID
//        Image image = imageRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + id));

//        return image.getUrl();
        return "hello-world";
    }
}
