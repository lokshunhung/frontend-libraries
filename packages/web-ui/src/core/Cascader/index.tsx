import React from "react";
import type {DefaultOptionType} from "rc-cascader";
import AntCascader from "antd/lib/cascader";
import type {ControlledFormValue} from "../../internal/type";
import {Nullable} from "./Nullable";
import {InitialNullable} from "./InitialNullable";
import "antd/lib/cascader/style";
import "./index.less";

/**
 * Attention:
 * CascaderDataNode.value must be unique in the whole data tree.
 */

export interface CascaderDataNode<T extends string | number> {
    label: string;
    value?: T; // Undefined if same with label
    disabled?: boolean;
    children?: Array<CascaderDataNode<T>>;
}

export interface BaseProps<T extends string | number> {
    data: Array<CascaderDataNode<T>>;
    canSelectAnyLevel?: boolean;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export interface Props<T extends string | number> extends BaseProps<T>, ControlledFormValue<T> {}

export class Cascader<T extends string | number> extends React.PureComponent<Props<T>> {
    static displayName = "Cascader";
    static Nullable = Nullable;
    static InitialNullable = InitialNullable;

    getAntValue = (): Array<string | number> => {
        const data = this.getAntDataSource();
        const getCascaderValues = (data: DefaultOptionType[]): Array<string | number> => {
            const {value} = this.props;
            for (const item of data) {
                if (item.value === value) {
                    return [item.value];
                } else if (item.children) {
                    const result = [item.value!, ...getCascaderValues(item.children)];
                    if (result.includes(value)) {
                        return result;
                    }
                }
            }
            return [];
        };
        return getCascaderValues(data);
    };

    getAntDataSource = (): DefaultOptionType[] => {
        const getAntChildren = (list: Array<CascaderDataNode<T>>): DefaultOptionType[] => {
            return list.map(node => ({
                label: node.label,
                disabled: node.disabled,
                value: node.value || node.label,
                children: node.children && node.children.length > 0 ? getAntChildren(node.children) : undefined,
            }));
        };
        return getAntChildren(this.props.data);
    };

    displayRender = (labels: React.ReactNode[]) => <React.Fragment>{labels.join("/")}</React.Fragment>;

    onChange = (antValue: Array<string | number>) => this.props.onChange(antValue[antValue.length - 1] as T);

    render() {
        const {canSelectAnyLevel, placeholder, disabled, style, className} = this.props;
        return (
            <AntCascader
                multiple={false}
                className={`g-cascader ${className || ""}`}
                dropdownClassName="g-cascader-popup"
                style={style}
                changeOnSelect={canSelectAnyLevel}
                value={this.getAntValue()}
                onChange={this.onChange}
                options={this.getAntDataSource()}
                allowClear={false}
                expandTrigger="hover"
                displayRender={this.displayRender}
                placeholder={placeholder}
                disabled={disabled}
            />
        );
    }
}
