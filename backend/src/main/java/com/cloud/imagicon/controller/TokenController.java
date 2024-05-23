package com.cloud.imagicon.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@RestController
public class TokenController {

    @PostMapping("/exchange-token")
    public ResponseEntity<String> exchangeToken(@RequestParam("code") String code) {
        // Set up request parameters for token exchange
        System.out.println("exchange-token");
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("client_id", "4rn99o5sdjhpann7ajk90e9mm7");
        requestBody.add("client_secret", "m9qiekj10haul4gm67h4c9re688jrrmo7691b9sjpkd0u9potig");
        requestBody.add("code", code);
        requestBody.add("redirect_uri", "http://localhost:3000/");
        System.out.println("Here is requestBody: " + requestBody);
        // Send a POST request to Cognito token endpoint
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity("https://springboot-trial.auth.us-east-1.amazoncognito.com/oauth2/token", requestBody, String.class);
        System.out.println("response: " + response.getBody());
        // Return token response to frontend
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
