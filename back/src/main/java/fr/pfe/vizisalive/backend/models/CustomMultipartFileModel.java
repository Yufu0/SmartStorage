package fr.pfe.vizisalive.backend.models;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class CustomMultipartFileModel {

    private MultipartFile file;
    private String name;
    private List<TagModel> tagModels;
}
