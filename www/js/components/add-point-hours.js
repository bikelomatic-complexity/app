import React, { Component } from 'react';
import DropDown from './drop-down';
import { RaisedButton, CardText, FontIcon, TimePicker } from 'material-ui';

const weekDays = [
  "Weekdays", "Weekends", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export class AddPointHours extends Component {

  constructor(props){
    super(props);
    this.state = {add:false};
  }

  componentDidMount() {
    const { setDrawer } = this.props;
    setDrawer('Add Hours');
  }

  onDaySelect(){
    this.setState({add:true});
  }

  addHours(){
    const { addPointHours } = this.props;
    const { openPicker, closePicker, dayDropDown } = this.refs;
    const { formatTime } = openPicker;

    const day = dayDropDown.getSelected();
    const opens = formatTime(openPicker.getTime());
    const closes = formatTime(closePicker.getTime());

    let days = [];
    if ( day == 'Weekdays') {
      days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
    } else if ( day == 'Weekends' ) {
      days = ["Saturday","Sunday"];
    } else {
      days = [day];
    }
    days.forEach((day)=>{
      addPointHours({day, opens, closes});
    });
    dayDropDown.setSelected(weekDays[(weekDays.indexOf(day)+1) % weekDays.length])
  }

  removeHours(index){
    const { removePointHours } = this.props;
    removePointHours(index);
  }

  render() {

    const midnight = new Date();
    midnight.setHours(0,0,0,0);

    return (
      <div className="form-column">
        <div style={{overflowX: "hidden"}}>
          <div className="form-row">
            <DropDown
              ref="dayDropDown"
              text={"Day(s)"}
              onSelectFunction={this.onDaySelect.bind(this)}
              options={weekDays}/>
          </div>
          <div className="form-row">
            <span> Opens at </span>
            <TimePicker
              style={{flex:5}}
              ref="openPicker"
              format="ampm"
              defaultTime={midnight}
            />
          </div>
          <div className="form-row">
            <span> Closes at </span>
            <TimePicker
              style={{flex:5}}
              ref="closePicker"
              format="ampm"
              defaultTime={midnight}
            />
          </div>
          <div className="form-row">
            <RaisedButton
              secondary
              disabled={!(this.state.add)}
              onClick={this.addHours.bind(this)}
              label="Add Hours"/>
          </div>
        </div>
        {this.props.newPoint.hours.sort((dayA, dayB)=>{

          return weekDays.indexOf(dayA.day) > weekDays.indexOf(dayB.day);

        }).map((day, index)=>{
          return (
            <div key={day.day+day.opens+day.closes} className="form-row">
              <RaisedButton
                onClick={this.removeHours.bind(this, index)}
                label={`${day.day}: ${day.opens} - ${day.closes}`}
                labelPosition="before"
                icon={<FontIcon className="material-icons">clear</FontIcon>}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

export default AddPointHours;
