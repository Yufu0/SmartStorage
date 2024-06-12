package fr.pfe.vizisalive.backend.models;

import lombok.Data;

import java.util.List;

@Data
public class RagResponseModel {

    public String query;
    public String answer;
    public List<String> ids;
}
