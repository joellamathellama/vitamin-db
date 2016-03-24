// require packages
const React              = require('react');
const connect            = require('react-redux').connect;
// components/files
const Schedule           = require('../components/Appointment/Schedule');
const mock               = require('../model/mockData');
// action files
const stateAction        = require('../actionCreators/stateActions');
const apptAction      = require('../actionCreators/appointmentActions');

const Appointment = ({states, dispatches}) => {
  return (
    <div>
      <Schedule immunization={states.immunization} doctor={states.doctor} appointment={states.appointment} removeAppt={dispatches.removeAppt} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    states: {
      doctor: state.userinfo.doctors,
      immunization: mock.Immunizations,
      appointment: state.appoint.map((val) => { return val.appointments })
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
      dispatches: {
        removeAppt: (id_appointment) => {
          dispatch(apptAction.RemoveAppointment(id_appointment))
        },

      }
    };
};

var wrappedAppointment = connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointment);

module.exports = wrappedAppointment;