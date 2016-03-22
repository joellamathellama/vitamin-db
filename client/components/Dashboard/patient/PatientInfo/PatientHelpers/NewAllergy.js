const React = require('react');
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const Grid = require('react-bootstrap').Grid;
const Panel = require('react-bootstrap').Panel;
const Button = require('react-bootstrap').Button;
const Glyphicon = require('react-bootstrap').Glyphicon;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Modal = require('react-bootstrap').Modal;
const Input = require('react-bootstrap').Input;
// const FormComponent = require('./Form');
// const FormUI = require('./FormUI');

const AddButton = React.createClass({
getInitialState() {
    return {
      show: false
    };
  },
  showModal() {
    this.setState({show: true});
  },
  hideModal() {
    this.setState({show: false});
  },
  render() {
  	return(
    	<div>
  

          <div className="patient-item">
            <Button bsStyle="primary" bsSize="small" onClick={this.showModal}><Glyphicon glyph="plus" /></Button>
            <h6 className="card-headline">Add New</h6>
          </div>

        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
          dialogClassName="custom-modal">

            <div className="card-full-text">
              <h2>Add an allergy:</h2>
      
              <form onSubmit={this.props.addAllergy} >
              	<Input name="allergen" type="text" label="Allergy:" placeholder="Allergy"/>
              	<Input name="currently" type="checkbox" label="Current allergy?"  />
              	<br/>
              	<Button type="submit" bsStyle="primary" bsSize="large" block>Add allergy</Button>
              </form>
            </div>

        </Modal>


    </div>
    )
  }
});

module.exports = AddButton;