import React from 'react';
import {db} from './Firebase/firebase';
import Flag from 'react-flags'

class Account extends React.Component {
    state = {

    }
    componentDidMount = () => {
        this.getFavoritesData();
        this.getScoresData();
    }
    getFavoritesData = () => {
        let countriesRef = db.collection(`/users/${this.props.user.uid}/favorites`);
        countriesRef.get().then(querySnapshot => {
            let data = [];
            querySnapshot.forEach( doc => {
                console.log(doc.data())
                console.log(doc.data)
                let info = {
                    id: doc.id,
                    data: doc.data().country
                }
                data.push(info);
            })
            console.log(data)
            this.setState({favorites: data})
        })
    }
    getScoresData = () => {
        let scoresRef = db.collection(`/users/${this.props.user.uid}/scores`);
        scoresRef.get().then(querySnapshot => {
            let data = [];
            querySnapshot.forEach( doc => {
                console.log(doc.data())
                console.log(doc.data)
                let info = {
                    id: doc.data().dateCreated,
                    data: doc.data()
                }
                data.push(info);
            })
            console.log(data)
            this.setState({scores: data})
        })
    }

    render(){
        return(
            <div>
                <h2>Logged in as {this.props.user.displayName}</h2>
                <img className="avatar" src={this.props.user.photoURL} alt=""/>
                <div className="row">
                    <div className="col">
                        {this.state.favorites && this.state.favorites.map(favorite => 
                            <div className="card mb-3" key={favorite.id}>
                                <h2>{favorite.id}</h2>
                                <h4>{favorite.data.name}</h4>
                                <Flag
                                    className="detailFlag align-self-end text-right img-thumbnail"
                                    name={(favorite.data.government.country_name.isoCode ? favorite.data.government.country_name.isoCode : "_unknown") ? favorite.data.government.country_name.isoCode : `_${favorite.data.name}`}
                                    format="svg"
                                    pngSize={64}
                                    shiny={false}
                                    alt={`${favorite.data.name}'s Flag`}
                                    basePath="/img/flags"
                                    />
                            </div>
                        )}
                    </div>
                    <div className="col">
                        {this.state.scores && this.state.scores.map(score => {
                            let milliseconds = score.data.dateCreated.seconds * 1000;
                            let currentDate = new Date(milliseconds);
                            console.log(currentDate);
                            let dateTime = currentDate.toGMTString();
                            console.log(dateTime);
                            return <div className="card mb-3" key={score.id}>
                                <h2>{dateTime}</h2>
                                <h4>Score - {score.data.score}</h4>
                                <h4>Correct - {score.data.correct}</h4>
                                <h4>Incorrect - {score.data.incorrect}</h4>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;