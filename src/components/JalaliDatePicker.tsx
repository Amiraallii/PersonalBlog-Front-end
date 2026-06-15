import { Fragment, useEffect, useRef, useState } from "react";
import DatePickerImport from "react-multi-date-picker";

const DatePicker = (DatePickerImport as any).default ?? DatePickerImport;
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

import DateObject from "react-date-object";

import "./JalaliDatePicker.css";

import ToolbarImport from "react-multi-date-picker/plugins/toolbar";

const Toolbar = (ToolbarImport as any).default ?? ToolbarImport;

interface JalaliDatePickerProps {
  value?: string;
  name: string;
  label?: string;
  required?: boolean;
  onChange: (event: {
    target: {
      name: string;
      value: string;
    };
  }) => void;
}

const JalaliDatePicker = ({
  value,
  onChange,
  name,
  label,
  required,
}: JalaliDatePickerProps) => {
  const [pickerValue, setPickerValue] = useState<DateObject | string>("");

  const lastValueRef = useRef<string>("");
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (value === lastValueRef.current) return;

    if (value) {
      const jalaliDate = new DateObject({
        date: value,
        format: "YYYY-MM-DD",
        calendar: gregorian,
      }).convert(persian);

      setPickerValue(jalaliDate);
      lastValueRef.current = value;
    } else {
      setPickerValue("");
      lastValueRef.current = "";
    }
  }, [value]);

  const handleDateChange = (dateObject: DateObject | null) => {
    setPickerValue(dateObject || "");

    if (!dateObject) {
      lastValueRef.current = "";

      onChange({
        target: {
          name,
          value: "",
        },
      });

      return;
    }

    const jsDate = dateObject.toDate();

    const gregorianDate = new DateObject({
      date: jsDate,
      calendar: gregorian,
      locale: gregorian_en,
    }).format("YYYY-MM-DD");

    lastValueRef.current = gregorianDate;

    onChange({
      target: {
        name,
        value: gregorianDate,
      },
    });
  };

  return (
    <Fragment>
      {label && <label className="text-sm text-muted pr-1">{label}</label>}

      <DatePicker
        ref={datePickerRef}
        calendar={persian}
        locale={persian_fa}
        value={pickerValue}
        onChange={(date: DateObject | null) => {
          handleDateChange(date);
        }}
        calendarPosition="bottom-start"
        fixMainPosition
        required={required}
        inputClass="w-full bg-[var(--background)] text-theme border border-theme px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
        containerClassName="w-full"
        plugins={[
          <Toolbar
            key="toolbar"
            position="bottom"
            sort={["today"]}
            names={{
              today: "برو به امروز",
            }}
          />,
        ]}
      />
    </Fragment>
  );
};

export default JalaliDatePicker;
