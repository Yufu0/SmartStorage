package fr.pfe.vizisalive.backend.models;

import fr.pfe.vizisalive.backend.enums.ELogLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LogModel {
    private ELogLevel logLevel;
    private String message;
    private Long timestamp;
}
