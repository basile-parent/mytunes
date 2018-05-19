import React from 'react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';
import {connect} from "react-redux";
import {assign} from "lodash";

import 'react-sortable-tree/style.css';
import '../../../../style/components/savedPlaylists.css';
import TreeNodeRenderer from "../renderers/TreeNodeRenderer";
import SavedPlaylistSortableList from "../components/SavedPlaylistSortableList";
import {musiquePropType} from "../../../common/types/MusiqueType";

class SavedPlaylists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: this._mapPlaylistToTreeItem(props.playlistProvider.playlists),
            selectedPlaylist: null,
            musiques: []
            // musiques: [{ id: 1, titre : "Test", bpm : 40, classement : 5, duree : 180, genreIds : [], path : '/' },
            //     { id: 2, titre : "Test 2", bpm : 60, classement : 5, duree : 235, genreIds : [], path : '/' },
            //     { id: 3, titre : "Test 3", bpm : 50, classement : 5, duree : 135, genreIds : [], path : '/' },
            //     { id: 4, titre : "Test 4", bpm : 45, classement : 5, duree : 245, genreIds : [], path : '/' }
            // ]
        };

        this._selectPlaylist = this._selectPlaylist.bind(this);
        this._onDeleteMusique = this._onDeleteMusique.bind(this);
    }

    render() {
        const { selectedPlaylist, treeData, musiques } = this.state;

        return (
        <div id={"savedPlaylists"}>
            <SortableTree
                treeData={treeData}
                onChange={treeData => this.setState({ treeData })}
                rowHeight={55}
                nodeContentRenderer={(props) => <TreeNodeRenderer onClick={this._selectPlaylist} {...props} /> }
                onClick={ (node) => console.log(node)}
            />
                {
                    !selectedPlaylist ?
                        <div id={"musiquesPlaylist"}>
                            <h1>Aucune playlist sélectionnée</h1>
                        </div>
                        :
                        <div id={"musiquesPlaylist"}>
                            <h1>{ selectedPlaylist.nom }</h1>
                            <SavedPlaylistSortableList musiques={musiques}
                                                       helperClass="playlistSortableHelper"
                                                       onDeleteMusique={this._onDeleteMusique}
                                                       pressDelay={200}
                            />
                        </div>
                }

        </div>);
    }

    _mapPlaylistToTreeItem(playlists) {
        return playlists.map(playlist => {
            return {
                id : playlist.id,
                title : playlist.nom,
                subtitle : this._getSubtitle(playlist),
                expanded : true,
                children : playlist.children ? this._mapPlaylistToTreeItem(playlist.children) : null
            }
        });
    }

    _getSubtitle(playlist) {
        return playlist.isFolder ?
            this._getPlaylistSubtitle(playlist) :
            this._getMusiqueSubtitle(playlist);
    }

    _getPlaylistSubtitle(playlist) {
        return playlist.children ?
            playlist.children.length > 1 ? playlist.children.length + " playlists" : playlist.children.length + " playlist"
            : "0 playlist"
            + !playlist.isFolder || playlist.musiqueIds.length > 0 ? " / " + this._getMusiqueSubtitle() : "";
    }

    _getMusiqueSubtitle(playlist) {
        return playlist.musiqueIds ?
            playlist.musiqueIds.length > 1 ? playlist.musiqueIds.length + " chansons" : playlist.musiqueIds.length + " chanson"
            : "0 chanson";
    }

    _selectPlaylist(node) {
        const playlist = this.props.playlistProvider.findById(node.id);
        let musiques = [];
        if (playlist.musiqueIds) {
            musiques = this.props.musiques.filter(musique => playlist.musiqueIds.includes(musique.id));
        }

        this.setState({
            ...this.state,
            selectedPlaylist: playlist,
            musiques
        });
    }

    _onDeleteMusique(musique) {
        console.log("delete", musique);
    }
}

SavedPlaylists.propTypes = {
    playlistProvider: PropTypes.object.isRequired,
    musiques: PropTypes.arrayOf(musiquePropType).isRequired
};
SavedPlaylists.defaultProps = {
    playlistProvider : [],
    musiques : []
};

export default connect(state => assign({}, {
    playlistProvider: state.playlistProvider,
    musiques: state.musiques
}), null)(SavedPlaylists);
