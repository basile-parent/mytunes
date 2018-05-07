package com.bparent.util;

import com.bparent.bean.ExportProperties;
import com.bparent.model.Musique;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.IOException;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ITunesExporterTest {

    @InjectMocks
    private ITunesExporter iTunesExporter;

    @Mock
    private Shell shell;

    @Mock
    private FileUtils fileUtils;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
        ITunesExporter.ffmpegCommand = "ffmpeg32";

        when(fileUtils.findUnexistingFileName(anyString())).thenAnswer(mock -> mock.getArguments()[0].toString());
    }

    @Test
    public void shouldExecuteTheRightCommand() throws IOException {
        ArgumentCaptor<String> cmdCaptor = ArgumentCaptor.forClass(String.class);
        iTunesExporter.exportTracks(buildMusiques(), "output/folder", buildExtractProperties());

        verify(shell, times(2)).exec(cmdCaptor.capture());

        assertEquals("ffmpeg32 -i \"path/to/Song.mp3\" -metadata title=\"Song\" -metadata artist=\"Artiste\" -metadata album=\"Album in 'properties'\" -metadata TBPM=\"120\" -metadata comment=\"Commentaire\" \"output/folder/30 - Song.mp3\"", cmdCaptor.getAllValues().get(0));
        assertEquals("ffmpeg32 -i \"second/path/to/Another Song.mp3\" -metadata title=\"Another Song\" -metadata album=\"Album in 'properties'\" -metadata comment=\"Commentaire Another Song\" \"output/folder/Another Song.mp3\"", cmdCaptor.getAllValues().get(1));
    }



    private ExportProperties buildExtractProperties() {
        ExportProperties properties = new ExportProperties();
        properties.setAlbum("Album in \"properties\"");
        properties.setGenre("Genre in properties");
        return properties;
    }

    private List<Musique> buildMusiques() {
        return Arrays.asList(
                new Musique(BigInteger.valueOf(1234), "Song", "Artiste", null, BigInteger.valueOf(240), null, null, BigInteger.valueOf(120), BigInteger.valueOf(5), "Commentaire", "path/to/Song.mp3"),
                new Musique(BigInteger.valueOf(1234), "Another Song", null, "Genre2", BigInteger.valueOf(260), null, null, null, BigInteger.valueOf(4), "Commentaire Another Song", "second/path/to/Another Song.mp3")
        );
    }

}