/*eslint-disable no-unused-vars*/
import React from 'react';
import DropDown from '../drop-down';
import { RaisedButton, CardText, FontIcon, TimePicker, SelectField, MenuItem } from 'material-ui';
import { HoursTable } from '../hours-table';
/*eslint-enable no-unused-vars*/

import WizardPage from './wizard-page';
import { Schedule, days, nextDay } from 'btc-models';

import { bindAll, keys, toPairs } from 'lodash';

// The pickers default to 8 AM and 5 PM respectively
const defaultOpens = new Date( 1970, 0, 1, 8, 0, 0, 0 );
const defaultClose = new Date( 1970, 0, 1, 17, 0, 0, 0 );

export class ServiceHours extends WizardPage {
  constructor( props ) {
    super( props );
    bindAll( this, 'addHours', 'removeHours', 'onRowSelection' );
  }

  componentWillMount() {
    const {point} = this.props;
    this.setState( {
      schedule: point.schedule,
      selectedRows: [],
      day: null,
      opens: defaultOpens,
      closes: defaultClose
    } );
  }

  componentDidMount() {
    this.props.setDrawer( 'Add Hours' );
  }

  getPageFields() {
    return [ 'schedule' ];
  }

  onRowSelection( selectedRows ) {
    this.setState( { selectedRows } );
  }

  addHours() {
    const {day, opens, closes} = this.state;

    const model = new Schedule( this.state.schedule );
    model.addHoursIn( day, opens, closes );

    this.setState( {
      schedule: model.get( 'schedule' ),
      day: nextDay( day )
    } );
  }

  removeHours( index ) {
    const model = new Schedule( this.state.schedule );
    model.delHoursIn( index );

    this.setState( {
      schedule: model.get( 'schedule' )
    } );
  }

  getPageContent() {
    const options = toPairs( days ).map( ( [day, values] ) => (
      <MenuItem key={ day }
        value={ day }
        primaryText={ values.display } />
    ) );
    return (
      <div className='wizard-page'>
        <SelectField fullWidth
          { ...this.link( 'day' ) }
          hintText="Day(s)">
          { options }
        </SelectField>
        <div className='wizard-page__row'>
          <span>Opens at</span>
          <TimePicker fullWidth
            { ...this.link( 'opens' ) }
            format='ampm'
            defaultTime={ defaultOpens } />
          <span>Closes at</span>
          <TimePicker fullWidth
            { ...this.link( 'closes' ) }
            format='ampm'
            defaultTime={ defaultClose } />
        </div>
        <HoursTable removable
          onRowRemove={ this.removeHours }
          hours={ this.state.schedule.default } />
        <div className="wizard-page__spacer"></div>
        <RaisedButton secondary
          disabled={ !this.state.day }
          onClick={ this.addHours }
          label="Add Hours" />
      </div>
      );
  }

  getPreferredTransition() {
    const {schedule} = this.state;

    if ( keys( schedule ).length > 0 ) {
      return WizardPage.transitions.next;
    } else {
      return WizardPage.transitions.skip;
    }
  }
}

export default ServiceHours;