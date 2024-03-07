package com.cloud.imagicon.DTO;
import java.util.List;
public class HelperDTO {


    public static class LambdaResponse {
        public int getStatusCode() {
            return statusCode;
        }

        public void setStatusCode(int statusCode) {
            this.statusCode = statusCode;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        private int statusCode;
        private String body;


        // Getter and setter methods
    }

    public static class Face {
        public String getFaceId() {
            return faceId;
        }

        public void setFaceId(String faceId) {
            this.faceId = faceId;
        }

        public String getExternalImageId() {
            return externalImageId;
        }

        public void setExternalImageId(String externalImageId) {
            this.externalImageId = externalImageId;
        }

        private String faceId;
        private String externalImageId;
        // Getter and setter methods
    }

    public static class SearchResponse {
        public List<Face> getFaces() {
            return faces;
        }

        public void setFaces(List<Face> faces) {
            this.faces = faces;
        }

        private List<Face> faces;
        // Getter and setter methods
    }
}
