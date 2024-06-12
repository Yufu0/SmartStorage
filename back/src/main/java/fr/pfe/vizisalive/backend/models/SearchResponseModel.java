package fr.pfe.vizisalive.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponseModel {

    public String answer;
    public List<Document> documents;
}
