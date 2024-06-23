package fr.pfe.vizisalive.backend.config;

import fr.pfe.vizisalive.backend.Environment;
import fr.pfe.vizisalive.backend.websocket.WebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new WebSocketHandler(), "/ws")
//                .setAllowedOrigins(Environment.ANGULAR_HOST + ":" + Environment.ANGULAR_PORT);
                .setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler gpsWebSocketHandler() {
        return new WebSocketHandler();
    }
}