package com.bparent.mytunes.controller.rest;

import com.bparent.mytunes.dto.PlaylistDTO;
import com.bparent.mytunes.repository.PlaylistRepository;
import com.bparent.mytunes.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @Autowired
    private PlaylistRepository playlistRepository;

    @GetMapping("/playlists")
    public List<PlaylistDTO> getAllPlaylist() {
        return this.playlistRepository.findByParentIsNull().stream()
                .map(PlaylistDTO::toDto)
                .collect(Collectors.toList());
    }

    @PutMapping("/playlist")
    @CrossOrigin
    public void savePlaylist(@RequestBody PlaylistDTO playlistDTO) {
        playlistRepository.save(playlistDTO.toEntity());
    }

    @PutMapping("/playlist/nom")
    @CrossOrigin
    public void updatePlaylistNom(@RequestBody PlaylistDTO playlistDTO) {
        this.playlistService.updatePlaylistNom(playlistDTO);
    }

    @PutMapping("/playlist/order")
    @CrossOrigin
    public void updateMusiqueOrder(@RequestBody PlaylistDTO playlistDTO) {
        this.playlistService.updatePlaylistOrder(playlistDTO);
    }

}
