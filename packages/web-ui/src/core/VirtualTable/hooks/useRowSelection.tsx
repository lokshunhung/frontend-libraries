import React from "react";
import {Checkbox} from "../../Checkbox";
import {ArrayUtil} from "../../../internal/ArrayUtil";
import type {VirtualTableColumn, VirtualTableRowSelection} from "../type";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
    dataSource: RowType[];
    rowSelection?: VirtualTableRowSelection<RowType>;
    rowKey: "index" | React.Key;
}

export const useRowSelection = function <RowType extends object>({columns, dataSource, rowSelection, rowKey}: Props<RowType>) {
    const transformedColumns = React.useMemo(() => {
        if (!rowSelection) {
            return [...columns];
        }

        const {width, onChange, selectedRowKeys, fixed, isDisabled, isSelectAllDisabled, title} = rowSelection;

        const allSelectionRowKeys: React.Key[] = [];
        const allSelectionRows: RowType[] = [];
        const unAllSelectionRowKeys: React.Key[] = [];
        const unAllSelectionRows: RowType[] = [];
        const enabledRowKeys: React.Key[] = [];
        const enabledCheckedRowKeys: React.Key[] = [];

        dataSource.forEach((data, rowIndex) => {
            const key = rowKey === "index" ? rowIndex : data[rowKey];
            const isSelected = selectedRowKeys.findIndex(_ => _ === key) !== -1;
            const isDisabledRow = isDisabled?.(data, rowIndex) || false;
            if (isDisabledRow) {
                if (isSelected) {
                    allSelectionRowKeys.push(key);
                    allSelectionRows.push(data[rowIndex]);
                    unAllSelectionRowKeys.push(key);
                    unAllSelectionRows.push(data[rowIndex]);
                }
            } else {
                enabledRowKeys.push(key);
                isSelected && enabledCheckedRowKeys.push(key);
                allSelectionRowKeys.push(key);
                allSelectionRows.push(data[rowIndex]);
            }
        });

        const onSelectAll = (val: boolean) => {
            return val ? onChange(allSelectionRowKeys, allSelectionRows) : onChange(unAllSelectionRowKeys, unAllSelectionRows);
        };

        const isAllSelectionDisabled = isSelectAllDisabled || enabledRowKeys.length === 0;
        const isAllSelected = enabledCheckedRowKeys.length > 0 && enabledRowKeys.length === enabledCheckedRowKeys.length;
        const isIndeterminate = enabledCheckedRowKeys.length > 0 && !isAllSelected;

        const rowSelectionColumn: VirtualTableColumn<RowType> = {
            width,
            fixed: fixed ? "left" : undefined,
            title: title || <Checkbox disabled={isAllSelectionDisabled} indeterminate={isIndeterminate} onChange={onSelectAll} value={isAllSelected} />,
            renderData: (data, rowIndex) => {
                const key = rowKey === "index" ? rowIndex : data[rowKey];
                const toggledSelectedRowKeys = ArrayUtil.toggleElement(selectedRowKeys, key);
                const toggledSelectedRow = ArrayUtil.toggleElement(dataSource, data);
                const isChecked = selectedRowKeys.findIndex(_ => _ === key) !== -1;
                return <Checkbox disabled={isDisabled?.(data, rowIndex)} value={isChecked} onChange={() => onChange(toggledSelectedRowKeys, toggledSelectedRow)} />;
            },
        };

        return [rowSelectionColumn, ...columns];
    }, [columns, dataSource, rowKey, rowSelection]);

    return transformedColumns;
};
