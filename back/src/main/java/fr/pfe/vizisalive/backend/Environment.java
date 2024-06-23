package fr.pfe.vizisalive.backend;

public final class Environment {
    public static final String API_KNOW_HOSTS_FILE = System.getenv("API_KNOW_HOSTS_FILE");

    public static final String SERVER_PORT = System.getenv("API_PORT");

    public static final String ANGULAR_HOST = System.getenv("ANGULAR_HOST");
    public static final String ANGULAR_PORT = System.getenv("ANGULAR_PORT");

    public static final String RAG_HOST = System.getenv("RAG_HOST");
    public static final String RAG_PORT = System.getenv("RAG_PORT");
    public static final String RAG_BASE_URL = RAG_HOST + ":" + RAG_PORT;

    public static final String SFTP_HOST = System.getenv("SFTP_HOST");
    public static final String SFTP_PORT = System.getenv("SFTP_PORT");
    public static final String SFTP_USERNAME = System.getenv("SFTP_USERNAME");
    public static final String SFTP_PASSWORD = System.getenv("SFTP_PASSWORD");

    public static final String MONGO_HOST = System.getenv("MONGO_HOST");
    public static final String MONGO_PORT = System.getenv("MONGO_PORT");
    public static final String MONGO_USER = System.getenv("MONGO_USER");
    public static final String MONGO_PASSWORD = System.getenv("MONGO_PASSWORD");

    public static final String MONGO_DATABASE = System.getenv("MONGO_DATABASE");
    public static final String MONGO_COLLECTION_FILES = System.getenv("MONGO_COLLECTION_FILES");
    public static final String MONGO_COLLECTION_LOGS = System.getenv("MONGO_COLLECTION_LOGS");
    public static final String MONGO_COLLECTION_USERS = System.getenv("MONGO_COLLECTION_USERS");
    public static final String MONGO_COLLECTION_TAGS = System.getenv("MONGO_COLLECTION_TAGS");

    public static final String JWT_COOKIE_NAME = System.getenv("JWT_COOKIE_NAME");
    public static final String JWT_SECRET = System.getenv("JWT_SECRET");
    public static final Long JWT_EXPIRATION_MS = Long.parseLong(System.getenv("JWT_EXPIRATION_MS"));
}
