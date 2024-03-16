package com.cloud.imagicon.DTO;

import java.util.List;

public class UserSearchDTO {
    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    private List<String> images;

}
