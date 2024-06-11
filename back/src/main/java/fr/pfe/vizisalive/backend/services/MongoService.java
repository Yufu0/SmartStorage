package fr.pfe.vizisalive.backend.services;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import fr.pfe.vizisalive.backend.Environment;
import fr.pfe.vizisalive.backend.enums.ELogLevel;
import fr.pfe.vizisalive.backend.models.CustomUserDetailsModel;
import fr.pfe.vizisalive.backend.models.DocumentModel;
import fr.pfe.vizisalive.backend.models.LogModel;
import fr.pfe.vizisalive.backend.models.TagModel;
import jakarta.annotation.PostConstruct;
import org.bson.Document;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MongoService {

    private MongoDatabase database;

    public MongoService() {
    }

    @PostConstruct
    private void initialize() {
        try {
            MongoClient mongoClient = MongoClients.create("mongodb://" + Environment.MONGO_USER + ":" + Environment.MONGO_PASS + "@" + Environment.MONGO_HOST + ":" + Environment.MONGO_PORT);
            this.database = mongoClient.getDatabase(Environment.MONGO_DB);
        } catch (Exception e) {
            System.out.println("MongoDB connection failed");
        }
    }

    public void addFile(String fileId, String filename, List<TagModel> tagModels) {
        try {
            String extension = "";
            String[] split = filename.split("\\.");

            if (split.length >= 2)
                extension = split[split.length - 1];

            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_FILES);

            Document document = new Document();
            document.append("fileId", fileId);
            document.append("filename", filename);
            document.append("extension", extension);

            List<Document> tagsDocument = tagModels.stream()
                    .map(tag -> new Document("label", tag.getLabel()).append("color", tag.getColor()))
                    .collect(Collectors.toList());

            document.append("tags", tagsDocument);

            collection.insertOne(document);
        } catch (Exception e) {
            System.out.println("MongoDB insert failed");
        }
    }

    public List<Document> findFilesByNameAndTags(String name, List<String> tags) {
        try {
            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_FILES);

            Document query = new Document();
            if (name != null && !name.isEmpty()) {
                query.append("filename", new Document("$regex", name));
            }
            if (tags != null && !tags.isEmpty()) {
                List<Document> tagsQuery = tags.stream()
                        .map(tag -> new Document("tags.label", tag))
                        .collect(Collectors.toList());
                query.append("$and", tagsQuery);
            }

            return collection.find(query).into(new ArrayList<>());
        } catch (Exception e) {
            System.out.println("MongoDB find failed");
            return new ArrayList<>();
        }
    }

    public List<Document> findFilesIds(List<String> ids) {
        try {
            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_FILES);

            Document query = new Document();
            query.append("fileId", new Document("$in", ids));

            return collection.find(query).into(new ArrayList<>());
        } catch (Exception e) {
            System.out.println("MongoDB find failed");
            return new ArrayList<>();
        }
    }

    public CustomUserDetailsModel findUser(String username) {
        try {
            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_USERS);

            Document document = collection.find(new Document("username", username)).first();

            if (document == null)
                return null;

            return new CustomUserDetailsModel(document.getString("username"), document.getString("password"));
        } catch (Exception e) {
            System.out.println("MongoDB find failed");
            return null;
        }
    }

    public void addUser(CustomUserDetailsModel user) {
        try {
            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_USERS);

            Document document = new Document();
            document.append("username", user.username());
            document.append("password", user.password());

            collection.insertOne(document);
        } catch (Exception e) {
            System.out.println("MongoDB insert failed");
        }
    }

    public List<TagModel> getTags() {
        MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_TAGS);
        return collection.find().into(new ArrayList<>()).stream()
                .map(doc -> new TagModel(doc.getString("label"), doc.getString("color")))
                .collect(Collectors.toList());
    }

    public void addTag(TagModel tagModel) {
        MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_TAGS);
        Document document = new Document("label", tagModel.getLabel())
                .append("color", tagModel.getColor());
        collection.insertOne(document);
    }

    public void removeTag(String label) {
        MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_TAGS);
        collection.deleteOne(new Document("label", label));
    }

    public void updateFile(DocumentModel document) {
        try {
            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_FILES);

            Document query = new Document("fileId", document.getFileId());

            List<Document> tagsDocument = document.getTags().stream()
                    .map(tag -> new Document("label", tag.getLabel()).append("color", tag.getColor()))
                    .collect(Collectors.toList());

            Document update = new Document("$set", new Document("filename", document.getFilename())
                    .append("tags", tagsDocument));

            collection.updateOne(query, update);
        } catch (Exception e) {
            System.out.println("MongoDB update failed");
        }
    }

    public void deleteFile(String fileId) {
        try {
            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_FILES);

            collection.deleteOne(new Document("fileId", fileId));
        } catch (Exception e) {
            System.out.println("MongoDB delete failed");
        }
    }

    public void log(ELogLevel logLevel, String message) {
        try {
            MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_LOGS);

            Document document = new Document();
            document.append("level", logLevel.name());
            document.append("message", message);
            document.append("timestamp", System.currentTimeMillis());

            collection.insertOne(document);
        } catch (Exception e) {
            System.out.println("MongoDB insert failed");
        }
    }

    public List<LogModel> getLogs() {
        MongoCollection<Document> collection = database.getCollection(Environment.MONGO_COLLECTION_LOGS);
        return collection
                .find()
                .sort(new Document("timestamp", -1))
                .limit(100)
                .into(new ArrayList<>())
                .stream()
                .map(doc -> new LogModel(
                        ELogLevel.valueOf(doc.getString("level")),
                        doc.getString("message"),
                        doc.getLong("timestamp"))
                )
                .collect(Collectors.toList());
    }
}
