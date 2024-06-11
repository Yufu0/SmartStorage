package fr.pfe.vizisalive.backend;

public final class Environment {
    public static String KNOW_HOSTS_FILE = System.getenv("KNOW_HOSTS_FILE");

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
    public static final String MONGO_PASS = System.getenv("MONGO_PASS");

    public static final String MONGO_DB = System.getenv("MONGO_DB");
    public static final String MONGO_COLLECTION_FILES = System.getenv("MONGO_COLLECTION_FILES");
    public static final String MONGO_COLLECTION_LOGS = System.getenv("MONGO_COLLECTION_LOGS");
    public static final String MONGO_COLLECTION_USERS = System.getenv("MONGO_COLLECTION_USERS");
    public static final String MONGO_COLLECTION_TAGS = System.getenv("MONGO_COLLECTION_TAGS");

    public static final String COOKIE_NAME = System.getenv("COOKIE_NAME");
    public static final String JWT_SECRET = System.getenv("JWT_SECRET");
    public static final Long JWT_EXPIRATION_MS = Long.parseLong(System.getenv("JWT_EXPIRATION_MS"));
}
