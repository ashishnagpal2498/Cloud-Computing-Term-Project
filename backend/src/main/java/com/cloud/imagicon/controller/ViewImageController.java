package com.cloud.imagicon.controller;

import com.cloud.imagicon.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ViewImageController {

    @Autowired
    private CollectionService collectionService;

    @GetMapping("/collections/{collectionName}")
    public ResponseEntity<Void> checkCollectionExists(@PathVariable String collectionName) {
        System.out.println("CollectionName --> " + collectionName);
        boolean exists = collectionService.checkCollection(collectionName);
        if (exists) {
            return ResponseEntity.ok().build(); // Return 200 OK if collection exists
        } else {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if collection does not exist
        }
    }
}
