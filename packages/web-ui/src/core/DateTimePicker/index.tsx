import AntDatePicker from "antd/lib/date-picker";
import moment from "moment";
import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import "antd/lib/date-picker/style";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? Date : Date | null> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    showNow?: boolean;
    disabledRange?: (diffHourToToday: number, date: Date) => boolean;
}

export class DateTimePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateTimePicker";

    isDateDisabled = (current: moment.Moment): boolean => {
        if (!current) {
            return false;
        }

        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }

        // moment will truncate the result to zero decimal places
        // ref: https://momentjs.com/docs/#/displaying/difference/
        const diffHourToToday = Math.floor(current.diff(moment().startOf("hour"), "hour", true));
        return this.props.disabledRange?.(diffHourToToday, current.toDate()) || false;
    };

    onChange = (date: moment.Moment | null) => {
        const typedOnChange = this.props.onChange as (value: Date | null) => void;
        if (date) {
            typedOnChange(date.toDate());
        } else {
            typedOnChange(null);
        }
    };

    render() {
        const {value, allowNull, disabled, showNow, className, placeholder} = this.props;
        return (
            <AntDatePicker
                className={className}
                placeholder={placeholder}
                disabledDate={this.isDateDisabled}
                value={value ? moment(value) : null}
                onChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
                showTime
                showNow={showNow}
            />
        );
    }
}
