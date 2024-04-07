package com.cloud.imagicon.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class EntryController {

    @GetMapping("/")
    public ResponseEntity<Map<String,String>> getFriendsList(){
        Map<String,String> result = new HashMap<>();
        result.put("message", "Viewing Imagicon Backend");
        return ResponseEntity.ok(result);
    }
}

