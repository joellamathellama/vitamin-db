const React = require('react');
const Panel = require('react-bootstrap').Panel;
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Col = require('react-bootstrap').Col;
const AddButton = require('../common/AddButton');


const FamilyHistPanel = ({familyhistory, family}) => {
	var current = familyhistory.map((curr) =>  {
		console.log(curr)
	})
	console.log(current);

	return (
		<Col xs={4} md={4}>
		<Panel collapsible header='Family History'>
	 		<ListGroup fill>
	 		{familyhistory.map((val) =>
				<ListGroupItem className="family-item">
				   {val.name + ': ' + val.condition}
				</ListGroupItem>
			)}
		 		{AddButton}
	 		</ListGroup>
  	 	</Panel>
  	 	</Col>
	)
}

module.exports = FamilyHistPanel;