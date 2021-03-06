import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addOrderPost } from '../../apiCalls';
import { addOrder } from '../../actions/index'

export class OrderForm extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      name: '',
      ingredients: []
    };
  }

  handleNameChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleIngredientChange = e => {
    e.preventDefault();
    this.setState({ingredients: [...this.state.ingredients, e.target.name]});
  }

  handleSubmit = e => {
    e.preventDefault();
    const { name, ingredients } = this.state
    const newOrder = {
      id: this.props.orders.length + 1,
      name,
      ingredients
    }
    addOrderPost(newOrder)
      .then(order => {
        this.props.addOrder(this.props.orders, order)
      })
      .catch(error => console.log(error))

    this.clearInputs();
  }

  clearInputs = () => {
    this.setState({name: '', ingredients: []});
  }

  canBeSubmitted() {
    const { name, ingredients } = this.state
    return name.length > 0 && ingredients.length > 0
  }

  render() {
    const isEnabled = this.canBeSubmitted()
    const possibleIngredients = ['beans', 'steak', 'carnitas', 'sofritas', 'lettuce', 'queso fresco', 'pico de gallo', 'hot sauce', 'guacamole', 'jalapenos', 'cilantro', 'sour cream'];
    const ingredientButtons = possibleIngredients.map(ingredient => {
      return (
        <button key={ingredient} name={ingredient} onClick={e => this.handleIngredientChange(e)}>
          {ingredient}
        </button>
      )
    });


    return (
      <form>
        <input
          type='text'
          placeholder='Name'
          name='name'
          value={this.state.name}
          onChange={e => this.handleNameChange(e)}
        />

        { ingredientButtons }

        <p>Order: { this.state.ingredients.join(', ') || 'Nothing selected' }</p>

        <button className="submit--order__button" disabled={!isEnabled} onClick={e => this.handleSubmit(e)}>
          Submit Order
        </button>
      </form>
    )
  }
}


export const mapStateToProps = ({ orders }) => ({
  orders
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addOrder,
  }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(OrderForm);
