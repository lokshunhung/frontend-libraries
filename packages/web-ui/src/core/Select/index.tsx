import type {SelectProps, SelectValue} from "antd/lib/select";
import AntSelect from "antd/lib/select";
import type {OptionProps as SelectOptionProps} from "rc-select/lib/Option";
import type {DefaultOptionType} from "rc-select/lib/Select";
import React from "react";
import "antd/lib/select/style";
import "./index.less";

export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "options"> {
    options?: Array<DefaultOptionType>;
}

export class Select<ValueType extends SelectValue> extends React.PureComponent<Props<ValueType>> {
    static displayName = "Select";

    static Option = AntSelect.Option;

    static OptGroup = AntSelect.OptGroup;

    render() {
        return <AntSelect {...this.props} />;
    }
}

export type {SelectValue, SelectOptionProps};
