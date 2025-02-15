import React from "react";
import AntCalendar from "antd/lib/calendar";
import type {HeaderRender} from "antd/lib/calendar/generateCalendar";
import type {Moment} from "moment";
import moment from "moment";
import type {ControlledFormValue} from "../internal/type";
import {Select} from "./Select";
import {Space} from "./Space";
import "antd/lib/calendar/style";

interface Props extends ControlledFormValue<string> {}

export class DateCalendar extends React.PureComponent<Props> {
    static displayName = "DateCalendar";

    private readonly headerStyle: React.CSSProperties = {padding: 8};

    private readonly now = moment();

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
        return false;
    };

    onChange = (date: Moment) => this.props.onChange(moment(date).format("YYYY-MM-DD"));

    renderHeader: HeaderRender<Moment> = ({value, onChange}) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        const current = value.clone();
        const localeData = this.now.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(localeData.monthsShort(current));
        }

        for (let index = start; index < end; index++) {
            monthOptions.push(
                <Select.Option value={index} key={`${index}`}>
                    {months[index]}
                </Select.Option>
            );
        }

        const month = value.month();
        const year = value.year();
        const yearOfNow = this.now.year();
        const options = [];

        for (let i = yearOfNow - 100; i <= yearOfNow; i++) {
            options.push(
                <Select.Option key={i} value={i}>
                    {i}
                </Select.Option>
            );
        }

        return (
            <div style={this.headerStyle}>
                <Space>
                    <div>
                        <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            onChange={newYear => {
                                const now = value.clone().year(newYear);
                                onChange(now);
                            }}
                            value={year}
                        >
                            {options}
                        </Select>
                    </div>
                    <div>
                        <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            value={month}
                            onChange={selectedMonth => {
                                const newValue = value.clone();
                                newValue.month(selectedMonth);
                                onChange(newValue);
                            }}
                        >
                            {monthOptions}
                        </Select>
                    </div>
                </Space>
            </div>
        );
    };

    render() {
        return <AntCalendar disabledDate={this.isDateDisabled} headerRender={this.renderHeader} value={moment(this.props.value, "YYYY-MM-DD")} fullscreen={false} onChange={this.onChange} />;
    }
}
