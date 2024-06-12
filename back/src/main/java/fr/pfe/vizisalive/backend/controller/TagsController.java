package fr.pfe.vizisalive.backend.controller;

import fr.pfe.vizisalive.backend.models.TagModel;
import fr.pfe.vizisalive.backend.services.MongoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagsController {

    private final MongoService mongoService;

    @GetMapping
    public ResponseEntity<List<TagModel>> getTags() {
        List<TagModel> tagModels = mongoService.getTags();
        return ResponseEntity.ok(tagModels);
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addTag(@RequestBody TagModel tagModel) {
        mongoService.addTag(tagModel);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> removeTag(@RequestBody String label) {
        mongoService.removeTag(label);
        return ResponseEntity.noContent().build();
    }
}