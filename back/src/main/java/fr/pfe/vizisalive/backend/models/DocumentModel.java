package fr.pfe.vizisalive.backend.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DocumentModel {
    private String fileId;
    private String filename;
    private List<TagModel> tags;
}
