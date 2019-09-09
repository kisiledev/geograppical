import React from 'react'
import Flag from 'react-flags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faAngleUp, faAngleDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom'

class AccountData extends React.Component {
    render(){
        return(
            <div className="col-12 my-3">
                <h5 onClick={() => this.toggleValue("favorites")}>Favorites ({this.state.loading ? 
                <FontAwesomeIcon icon={faSpinner} spin /> : this.state.favorites && this.state.favorites.data.length>0 && this.state.favorites.data.length})
                {this.state.favorites && <FontAwesomeIcon className="align-text-top" icon={this.state.favorites.isOpen ? faAngleDown : faAngleUp} />}
                </h5>
                {this.state.loading ? null : 
                    (
                    this.state.favorites &&
                    <Collapse in={this.state.favorites.isOpen}>
                    <ul className="list-group list-group-flush">
                        {this.state.favorites && this.state.favorites.data.length > 0 ? 
                            this.state.favorites.data.map(favorite =>
                            <li className="list-group-item" key={favorite.id}>
                                <h5>{favorite.id} - <small>{favorite.data.government.capital.name.split(';')[0]}</small></h5>
                                <div className="d-flex justify-content-between">
                                <Link to={`${process.env.PUBLIC_URL}/${this.props.simplifyString(favorite.id)}`} >
                                    <Flag
                                        className="favFlag img-thumbnail"
                                        name={(favorite.data.government.country_name.isoCode ? favorite.data.government.country_name.isoCode : "_unknown") ? favorite.data.government.country_name.isoCode : `_${favorite.data.name}`}
                                        format="svg"
                                        pngSize={64}
                                        shiny={false}
                                        alt={`${favorite.data.name}'s Flag`}
                                        basePath="/img/flags"
                                    />
                                </Link>
                                    <FontAwesomeIcon className="align-self-center" onClick={() => this.deleteFavorite(favorite.id)} icon={faTrashAlt} size="2x" color="darkred" />
                                </div>
                            </li>
                        ) : <h5>You have no favorites saved</h5> }
                    </ul>
                    </Collapse>)
                }
            </div>
        )
    }
}
export default AccountData