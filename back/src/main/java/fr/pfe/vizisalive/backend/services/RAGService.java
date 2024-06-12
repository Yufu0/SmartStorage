package fr.pfe.vizisalive.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.pfe.vizisalive.backend.Environment;
import fr.pfe.vizisalive.backend.models.*;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RAGService {

    @Autowired MongoService mongoService;

    private final HttpClient client = HttpClient.newHttpClient();

    public String uploadFile(String url, InputStream fileStream, String fileName, List<TagModel> tagModels, String id) {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(url);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody("file", fileStream, ContentType.DEFAULT_BINARY, fileName);
            builder.addTextBody("id", id, ContentType.TEXT_PLAIN);
            builder.addTextBody("tags", tagModels.stream().map(TagModel::getLabel).collect(Collectors.joining(",")), ContentType.TEXT_PLAIN);

            httpPost.setEntity(builder.build());

            try (CloseableHttpResponse response = client.execute(httpPost)) {
                if (response.getStatusLine().getStatusCode() == 200) {
                    return "File uploaded successfully";
                } else {
                    return "Upload failed with status code: " + response.getStatusLine().getStatusCode();
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Request failed", e);
        }
    }

    public SearchResponseModel searchFileWithRAG(String url, String query, List<String> tags) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            URI uri = URI.create(url + "?query=" + encodedQuery + "&tags=" + String.join(",", tags));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                RagResponseModel ragResponseModel = mapper.readValue(response.body(), RagResponseModel.class);
                return new SearchResponseModel(ragResponseModel.getAnswer(), mongoService.findFilesIds(ragResponseModel.getIds()));
            } else {
                throw new RuntimeException("Search failed with status: " + response.statusCode());
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Request failed", e);
        }
    }

    public void updateFile(DocumentModel document) {
        try {
            URI uri = URI.create(Environment.RAG_BASE_URL + "/update"  + "?id=" + document.getFileId() + "&filename=" + document.getFilename() + "&tags=" + document.getTags().stream().map(TagModel::getLabel).collect(Collectors.joining(",")));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new RuntimeException("Update failed with status: " + response.statusCode());
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Request failed", e);
        }
    }

    public void deleteFile(String fileId) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(Environment.RAG_BASE_URL + "/delete?id=" + fileId))
                    .DELETE()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new RuntimeException("Delete failed with status: " + response.statusCode());
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Request failed", e);
        }
    }

    public boolean ping(String url) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .timeout(java.time.Duration.ofSeconds(5))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (IOException | InterruptedException e) {
            return false;
        }
    }
}