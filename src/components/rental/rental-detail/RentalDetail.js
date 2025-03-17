import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

class RentalDetail extends Component {

    componentWillMount() {
        const rentalId = this.props.match.params.id;
        this.props.dispatch(actions.fetchRentalById(rentalId));
    }

    render() {
        const rental = this.props.rental;
        if (rental.id) {
            return (
                <h1>Rental Detail Component - {rental.title}</h1>
            )
        } else {
            return (
                <h3>Loading...</h3>
            )
        }

    }
}

const mapStateToProps = (state) => {
    return {
        rental: state.rental.data
    }
}


export default connect(mapStateToProps)(RentalDetail);
