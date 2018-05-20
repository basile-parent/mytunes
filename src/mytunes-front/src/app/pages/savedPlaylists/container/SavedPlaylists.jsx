import React from 'react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';
import {connect} from "react-redux";
import {assign} from "lodash";
import {bindActionCreators} from "redux";
import {arrayMove} from 'react-sortable-hoc';

import 'react-sortable-tree/style.css';
import '../../../../style/components/savedPlaylists.css';
import TreeNodeRenderer from "../renderers/TreeNodeRenderer";
import SavedPlaylistSortableList from "../components/SavedPlaylistSortableList";
import {musiquePropType} from "../../../common/types/MusiqueType";
import PlaylistsActions from "../actions/PlaylistsActions";
import {__KEYCODE_ENTER__} from "../../../../App";

class SavedPlaylists extends React.Component {
    constructor(props) {
        super(props);

        const { playlistId } = this.props.match.params;
        const selectedPlaylist = playlistId ? props.playlistProvider.findById(parseInt(playlistId)) : null;

        this.state = {
            treeData: this._mapPlaylistToTreeItem(props.playlistProvider.playlists),
            selectedPlaylist,
            musiques: selectedPlaylist ? this._getMusiques(selectedPlaylist) : []
        };

        this.inputPlaylistNom = null;

        this._selectPlaylist = this._selectPlaylist.bind(this);
        this._onDeleteMusique = this._onDeleteMusique.bind(this);
        this._updatePlaylistName = this._updatePlaylistName.bind(this);
        this._sortEnd = this._sortEnd.bind(this);
    }

    render() {
        const { selectedPlaylist, treeData, musiques } = this.state;

        return (
        <div id={"savedPlaylists"}>
            <SortableTree
                key={selectedPlaylist ? "savedPlaylistsTree_" + selectedPlaylist.id : "savedPlaylistsTree_key"}
                treeData={treeData}
                onChange={treeData => this.setState({ treeData })}
                rowHeight={55}
                maxDepth={4}
                nodeContentRenderer={(props) => <TreeNodeRenderer onClick={this._selectPlaylist}
                                                                  selectedPlaylist={selectedPlaylist}
                                                                  {...props} /> }
            />
                {
                    !selectedPlaylist ?
                        <div id={"musiquesPlaylist"}>
                            <h1>Aucune playlist sélectionnée</h1>
                        </div>
                        :
                        <div id={"musiquesPlaylist"}>
                            <header>
                                <input ref={instance => this.inputPlaylistNom = instance }
                                       value={selectedPlaylist.nom}
                                       onChange={event => {
                                           this.setState({
                                               ...this.state,
                                               selectedPlaylist : {...selectedPlaylist, nom : event.target.value}
                                           });
                                       }}
                                       onKeyPress={e => {
                                           if (e.which === __KEYCODE_ENTER__ || e.keyCode === __KEYCODE_ENTER__) {
                                               this.inputPlaylistNom.blur();
                                           }
                                       }}
                                       onBlur={event => this._updatePlaylistName(selectedPlaylist.id, event.target.value)}
                                />
                            </header>
                            <SavedPlaylistSortableList musiques={musiques}
                                                       helperClass="playlistSortableHelper"
                                                       onDeleteMusique={this._onDeleteMusique}
                                                       pressDelay={200}
                                                       onSortEnd={ this._sortEnd }
                            />
                        </div>
                }

        </div>);
    }

    _sortEnd({oldIndex, newIndex}) {
        const { selectedPlaylist, musiques } = this.state;
        const musiqueSorted = arrayMove([...musiques], oldIndex, newIndex);
        this.props.playlistsActions.updateMusiqueOrder(selectedPlaylist.id, musiqueSorted);
        this.setState({
            ...this.state,
            musiques: musiqueSorted
        });
    }

    _mapPlaylistToTreeItem(playlists) {
        return !(playlists && playlists.length) ? [] : playlists.map(playlist => {
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

        this.setState({
            ...this.state,
            selectedPlaylist: playlist,
            musiques: this._getMusiques(playlist)
        });
    }

    _getMusiques(playlist) {
        const musiques = [];

        if (playlist.musiqueIds) {
            for (let id of playlist.musiqueIds) {
                musiques.push(this.props.musiques.filter(musique => musique.id === id)[0]);
            }
        }

        return musiques;
    }

    _updatePlaylistName(id, name) {
        this.props.playlistsActions.updatePlaylistNom(id, name);

        let playlists = [...this.props.playlistProvider.playlists];
        playlists = this._updatePlaylistNameRecursive(playlists, id, name);
        this.setState({
            ...this.state,
            treeData: this._mapPlaylistToTreeItem(playlists)
        });
    }

    _updatePlaylistNameRecursive(playlists, id, name) {
        for (let playlist of playlists) {
            if (playlist.id === id) {
                playlist.nom = name;
                break;
            } else {
                playlist.children = this._updatePlaylistNameRecursive(playlist.children, id, name);
            }
        }

        return playlists;
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
}), dispatch => ({
    playlistsActions: bindActionCreators(PlaylistsActions, dispatch)
}))(SavedPlaylists);
