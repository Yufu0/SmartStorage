package fr.pfe.vizisalive.backend.controller;

import fr.pfe.vizisalive.backend.models.LogModel;
import fr.pfe.vizisalive.backend.services.MongoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/logs")
public class LogController {

    @Autowired
    private MongoService mongoService;

    @GetMapping
    public ResponseEntity<List<LogModel>> getLogs() {
        List<LogModel> logModels = mongoService.getLogs();
        return ResponseEntity.ok(logModels);
    }
}
