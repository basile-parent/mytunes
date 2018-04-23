import React from 'react';
import ListeMusiqueHeader from "../components/ListeMusiqueHeader";
import ListeMusiqueItem from "../components/ListeMusiqueItem";
import { __SERVER_URL__ } from "../../../../App";

export default class ListeMusique extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      musiques : []
    };
  
    this.addMusiqueToPlaylist = this.addMusiqueToPlaylist.bind(this);
    this.updateRating = this.updateRating.bind(this);
  }
  
  updateRating = (rating, musique) => {
    console.log(musique.titre + " : new rating = " + rating);
    
    // const payload = {
    //   musique: musique,
    //   newClassement: rating
    // };
    // axios.put(__SERVER_URL__ + "/classement", payload);
  
    // this.stompClient.send({
    //     musique: musique,
    //     newClassement: rating
    // });
  };
  
  updateProperty = (musique) => {
    console.log("updateProperty", musique);
  };
  
  addMusiqueToPlaylist = (musique) => {
    console.log("addMusiqueToPlaylist " + musique.titre);
  };
  
  componentDidMount() {
    fetch(__SERVER_URL__ + "all-musiques") //, { mode: 'no-cors' })
    .then(response => response.json())
    .then(musiqueList => {
      this.setState({
        ...this.state,
        musiques : musiqueList
      });
    })
    .catch(e => {
      console.error(e);
    });
  }
  
  render() {
    return (
      <section className="listeMusiques">
        <table>
          <thead>
          <ListeMusiqueHeader />
          </thead>
          <tbody>
          {
            this.state.musiques.map(musique => (
              <ListeMusiqueItem musique={ musique }
                                key={ musique.itunesId }
                                addMusiqueToPlaylist={ this.addMusiqueToPlaylist }
                                updateRating={ this.updateRating }
                                updateProperty={ this.updateProperty }
              />
            ))
          }
          </tbody>
        </table>
      </section>
    );
  }
}

ListeMusique.propTypes = {
};
