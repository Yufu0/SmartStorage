package fr.pfe.vizisalive.backend.websocket;

import lombok.Getter;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class WebSocketHandler extends TextWebSocketHandler {

    @Getter
    private static final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    public WebSocketHandler() {
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("Connection established");
        sessions.add(session);

        try {
            synchronized (session) {
                session.sendMessage(new TextMessage("Connection established"));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("Connection closed " + status.getReason());
        sessions.remove(session);
    }
}
