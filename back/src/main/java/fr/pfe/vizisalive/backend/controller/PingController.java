package fr.pfe.vizisalive.backend.controller;

import fr.pfe.vizisalive.backend.Environment;
import fr.pfe.vizisalive.backend.services.RAGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class PingController {

    @Autowired
    RAGService ragService;

    @GetMapping("/ping/api")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "pong");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping/rag")
    public ResponseEntity<Map<String, String>> pingRag() {
        Map<String, String> response = new HashMap<>();
        if(ragService.ping(Environment.RAG_BASE_URL + "/ping"))
            response.put("message", "pong");
        else
            response.put("message", "error");
        return ResponseEntity.ok(response);
    }
}
