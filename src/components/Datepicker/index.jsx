import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'
import { format } from 'date-fns';

import CalendarSVG from '../../assets/calendar.svg'

// eslint-disable-next-line react/prop-types
const Datepicker = ({date, onChangeDate}) => {

  // eslint-disable-next-line react/display-name, react/prop-types
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="flex flex-row items-center cursor-pointer text-2xl font-bold" onClick={onClick} ref={ref}>
        <img src={CalendarSVG} className='w-[26px] h-[26px] mr-2'/>
        {formatDate(value)}
    </div>
  ));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "EEEE do MMMM yyyy");
  };

  return (
    <div className='z-[30]'>
    <DatePicker
      selected={date}
      onChange={(date) => onChangeDate(date)}
      customInput={<ExampleCustomInput />}
    />
    </div>
  );
};

export default Datepicker