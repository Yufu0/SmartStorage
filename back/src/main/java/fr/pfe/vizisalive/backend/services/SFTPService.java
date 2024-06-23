package fr.pfe.vizisalive.backend.services;

import com.jcraft.jsch.*;
import fr.pfe.vizisalive.backend.Environment;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
public class SFTPService {

    private static final String CHANEL_TYPE = "sftp";

    public SFTPService() {}

    public void uploadFile(InputStream file, String filename) {
        ChannelSftp channel = getChannel();
        if(channel == null) return;
        try {
            channel.connect();
            channel.cd("/files");
            channel.put(file, filename);
        } catch (JSchException | SftpException e) {
            e.printStackTrace();
        } finally {
            channel.disconnect();
        }
    }

    public byte[] downloadFile(String fileId) {
        ChannelSftp channel = getChannel();
        byte[] bytes = null;
        if(channel == null) return null;
        try {
            channel.connect();
            InputStream inputStream = channel.get("/files/" + fileId);
            bytes = inputStream != null ? inputStream.readAllBytes() : null;
        } catch (SftpException e) {
            e.printStackTrace();
        } catch (IOException | JSchException e) {
            throw new RuntimeException(e);
        } finally {
            channel.disconnect();
        }
        return bytes;
    }

    private ChannelSftp getChannel() {
        try {
            JSch jsch = new JSch();
            jsch.setKnownHosts(Environment.API_KNOW_HOSTS_FILE);
            Session jschSession = jsch.getSession(Environment.SFTP_USERNAME, Environment.SFTP_HOST, Integer.parseInt(Environment.SFTP_PORT));
            jschSession.setPassword(Environment.SFTP_PASSWORD);
            jschSession.connect();
            return (ChannelSftp) jschSession.openChannel("sftp");
        } catch (JSchException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void deleteFile(String fileId) {
        ChannelSftp channel = getChannel();
        if(channel == null) return;
        try {
            channel.connect();
            channel.rm("/files/" + fileId);
        } catch (SftpException | JSchException e) {
            e.printStackTrace();
        } finally {
            channel.disconnect();
        }
    }
}