package fr.pfe.vizisalive.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;

import java.util.Collections;

@SpringBootApplication(exclude = {
		MongoAutoConfiguration.class,
		MongoDataAutoConfiguration.class
})
public class Application {
	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(Application.class);
		app.setDefaultProperties(Collections
				.singletonMap("server.port", Environment.SERVER_PORT));
		app.run(args);
	}
}