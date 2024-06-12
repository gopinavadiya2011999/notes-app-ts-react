import "../css/DatePicker.css";

interface Props {
  date: string;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeDate: () => void;
}

const DateTimePicker = ({ date, handleDateChange, removeDate }: Props) => {
  //const formatCurrentDate = (dateTime: Date): string => {
  //   if (!(dateTime instanceof Date) || isNaN(dateTime.getTime())) {
  //     return "";
  //   }

  //   const currentDate = new Date();
  //   const diffInDays = Math.floor(
  //     (dateTime.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  //   );
  //   let formattedDate = "";

  //   if (diffInDays === 0) {
  //     formattedDate = "Today";
  //   } else if (diffInDays === 1) {
  //     formattedDate = "Tomorrow";
  //   } else {
  //     formattedDate = dateTime.toLocaleDateString("en-US", { weekday: "long" });
  //   }

  //   const formattedTime = dateTime.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });

  //   return `${formattedDate}, ${formattedTime}`;
  // };
  // const formatDateTimeFromString = (dateTimeString: string): string => {
  //   const inputDate = new Date(dateTimeString); // Create Date object from string
  //   const currentDate = new Date(); // Current date

  //   let formattedDate = "";

  //   // Check if input date is today
  //   if (
  //     inputDate.getDate() === currentDate.getDate() &&
  //     inputDate.getMonth() === currentDate.getMonth() &&
  //     inputDate.getFullYear() === currentDate.getFullYear()
  //   ) {
  //     formattedDate = "Today";
  //   } else if (
  //     inputDate.getDate() === currentDate.getDate() + 1 &&
  //     inputDate.getMonth() === currentDate.getMonth() &&
  //     inputDate.getFullYear() === currentDate.getFullYear()
  //   ) {
  //     formattedDate = "Tomorrow";
  //   } else {
  //     formattedDate = inputDate.toLocaleDateString("en-US", {
  //       weekday: "long",
  //     });
  //   }

  //   const formattedTime = inputDate.toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "numeric",
  //   });

  //   return `${formattedDate}, ${formattedTime}`;
  // };

  return (
    <div className="datepicker-cotainer">
      <i className="bi bi-clock" />

      <input
        type="datetime-local"
        value={date}
        onChange={handleDateChange}
        className="datetime-input"
        placeholder="pick date"
        style={{ color: "var(--secondary-color)" }}
      />
      <i
        className="bi bi-x"
        style={{
          color: "var(--secondary-color)",
        }}
        onClick={removeDate}
      />
    </div>
  );
};

export default DateTimePicker;
