package fr.pfe.vizisalive.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.pfe.vizisalive.backend.Environment;
import fr.pfe.vizisalive.backend.models.DocumentModel;
import fr.pfe.vizisalive.backend.models.SearchResponseModel;
import fr.pfe.vizisalive.backend.models.TagModel;
import fr.pfe.vizisalive.backend.services.MongoService;
import fr.pfe.vizisalive.backend.services.RAGService;
import fr.pfe.vizisalive.backend.services.SFTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/api/files")
public class FilesController {

    @Autowired
    private MongoService mongoService;

    @Autowired
    private SFTPService sftpService;

    @Autowired
    private RAGService ragService;


    @GetMapping
    public ResponseEntity<String> getFiles() {
        return ResponseEntity.status(HttpStatus.OK).body("Files");
    }

    @PostMapping("/upload")
    public ResponseEntity<Void> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("metadata") String metadataJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> metadata = objectMapper.readValue(metadataJson, new TypeReference<>() {
            });

            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                Map<String, Object> fileMetadata = metadata.get(i);

                String name = (String) fileMetadata.get("name");
                List<TagModel> tagModels = objectMapper.convertValue(fileMetadata.get("tags"), new TypeReference<>() {
                });

                if (file.isEmpty()) {
                    System.out.println("Fichier vide reçu");
                    continue;
                }

                String generateFileName = generateFileName(name);

                mongoService.addFile(generateFileName, file.getOriginalFilename(), tagModels);
                sftpService.uploadFile(file.getInputStream(), generateFileName);
                ragService.uploadFile(Environment.RAG_BASE_URL + "/insert", file.getInputStream(), file.getOriginalFilename(), tagModels, generateFileName);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Void> updateFile(
            @RequestBody DocumentModel documentModel) {
        mongoService.updateFile(documentModel);
        ragService.updateFile(documentModel);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteFile(
            @RequestParam("fileId") String fileId) {
        mongoService.deleteFile(fileId);
        sftpService.deleteFile(fileId);
        ragService.deleteFile(fileId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/search")
    public ResponseEntity<SearchResponseModel> searchFiles(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "tags", required = false) List<String> tags) {
        SearchResponseModel response = new SearchResponseModel("", mongoService.findFilesByNameAndTags(name, tags));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/searchRAG")
    public ResponseEntity<SearchResponseModel> searchFilesWithRAG(
            @RequestParam(value = "query") String query,
            @RequestParam(value = "tags", required = false) List<String> tags) {
        return ResponseEntity.ok(ragService.searchFileWithRAG(Environment.RAG_BASE_URL + "/rag", query, tags));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(
            @RequestParam("fileId") String fileId,
            @RequestParam("filename") String filename) {
        byte[] fileContent = sftpService.downloadFile(fileId);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
        headers.add(HttpHeaders.CONTENT_TYPE, determineContentType(filename));
        return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
    }

    private static String generateFileName(String filename) {
        return filename + "_" + UUID.randomUUID();
    }

    private String determineContentType(String fileName) {
        return switch (fileName.substring(fileName.lastIndexOf("."))) {
            case ".pdf" -> "application/pdf";
            case ".json" -> "application/json";
            case ".xml" -> "application/xml";
            case ".txt" -> "text/plain";
            case ".csv" -> "text/csv";
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            case ".gif" -> "image/gif";
            default -> "application/octet-stream";
        };
    }
}
