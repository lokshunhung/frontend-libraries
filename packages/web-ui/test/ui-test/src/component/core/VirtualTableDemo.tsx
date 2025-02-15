import {Button} from "@pinnacle0/web-ui/core/Button";
import type {VirtualTableColumn, VirtualTableRowSelection, VirtualTableRowExpand} from "@pinnacle0/web-ui/core/VirtualTable/type";
import {VirtualTable} from "@pinnacle0/web-ui/core/VirtualTable";
import {Modal} from "@pinnacle0/web-ui/core/Modal";
import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

interface Profile {
    name: string;
    age: number;
    address: string;
}

const data: Profile[] = Array.from({length: 10000}, () => ({
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
}));

const extraColumns = Array.from({length: 20}, (_, idx) => ({
    title: `test col ${idx + 1}`,
    width: 70,
    renderData: () => idx + 1,
}));

const getColumns = (horizontalScroll: boolean = false): VirtualTableColumn<Profile>[] => {
    return [
        {
            title: "Name",
            width: 100,
            fixed: horizontalScroll ? "left" : undefined,
            renderData: _ => _.name,
        },
        {
            title: "Address",
            width: 120,
            fixed: horizontalScroll ? "left" : undefined,
            renderData: _ => _.address,
        },
        ...(horizontalScroll ? extraColumns : []),
        {
            title: "fixed 1",
            width: 120,
            fixed: "right",
            renderData: () => "fixed 1",
        },
        {
            title: "age",
            width: 70,
            fixed: horizontalScroll ? "right" : undefined,
            renderData: _ => _.age,
        },
        {
            title: "action",
            width: 140,
            fixed: horizontalScroll ? "right" : undefined,
            renderData: () => <Button>Click Me</Button>,
        },
        {
            title: "hidden column",
            width: 200,
            fixed: "right",
            display: "hidden",
            renderData: () => "hidden",
        },
    ];
};

const VirtualTableWithData = ({hasData = false}: {hasData?: boolean}) => {
    return <VirtualTable rowKey="index" rowHeight={50} dataSource={hasData ? data : []} scrollY={400} scrollX={800} columns={getColumns()} />;
};

const LoadingVirtualTable = () => <VirtualTable rowKey="index" rowHeight={50} dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} loading />;

const VirtualTableWithRowSelection = () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>(Array.from({length: data.length}, (_, idx) => idx));
    const rowSelection: VirtualTableRowSelection<Profile> = {
        width: 40,
        onChange: _ => setSelectedRowKeys(_),
        isDisabled: (data, rowIndex) => rowIndex === 0,
        fixed: true,
        selectedRowKeys,
    };
    return <VirtualTable rowKey="index" rowHeight={50} rowSelection={rowSelection} dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} />;
};

const VirtualTableWithVariousData = () => {
    const [data, setData] = React.useState<Profile[]>([]);
    const singleData = {
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    };

    const addOneData = () => setData([...data, singleData]);
    const addTenData = () => setData([...data, ...Array.from({length: 10}, () => singleData)]);
    const deleteLastData = () => setData(data.slice(0, data.length - 1));
    const deleteLastTenData = () => setData(data.slice(0, data.length - 10));

    return (
        <div>
            <div style={{display: "flex", justifyContent: "space-around", width: 800}}>
                <Button onClick={addOneData}>add 1 data</Button>
                <Button onClick={addTenData}>add 10 data</Button>
                <Button onClick={deleteLastData}>delete 1 data</Button>
                <Button onClick={deleteLastTenData}>delete 10 data</Button>
            </div>
            <VirtualTable rowKey="index" rowHeight={50} dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} />
        </div>
    );
};

const VirtualTableWithVariousDataAndRowSelection = () => {
    const [data, setData] = React.useState<Profile[]>([]);
    const singleData = {
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    };

    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>(Array.from({length: data.length}, (_, idx) => idx));
    const rowSelection: VirtualTableRowSelection<Profile> = {
        width: 40,
        onChange: _ => setSelectedRowKeys(_),
        isDisabled: (data, rowIndex) => rowIndex === 0,
        fixed: true,
        selectedRowKeys,
    };

    const addOneData = () => setData([...data, singleData]);
    const addTenData = () => setData([...data, ...Array.from({length: 10}, () => singleData)]);
    const deleteLastData = () => setData(data.slice(0, data.length - 1));
    const deleteLastTenData = () => setData(data.slice(0, data.length - 10));

    return (
        <div>
            <div style={{display: "flex", justifyContent: "space-around", width: 800}}>
                <Button onClick={addOneData}>add 1 data</Button>
                <Button onClick={addTenData}>add 10 data</Button>
                <Button onClick={deleteLastData}>delete 1 data</Button>
                <Button onClick={deleteLastTenData}>delete 10 data</Button>
            </div>
            <VirtualTable rowSelection={rowSelection} rowKey="index" rowHeight={50} dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} />
        </div>
    );
};

const VirtualTableWithFixedColumns = () => {
    return <VirtualTable rowKey="index" rowHeight={50} dataSource={data} scrollY={400} scrollX={800} columns={getColumns(true)} />;
};

const VirtualTableInModal = () => {
    const [showModal, setShowModal] = React.useState(false);

    const toggleModal = React.useCallback(() => setShowModal(!showModal), [showModal]);

    return (
        <div>
            <Button onClick={toggleModal}>Show Modal</Button>
            {showModal && (
                <Modal width={1300} onCancel={toggleModal}>
                    <VirtualTable rowKey="index" rowHeight={50} dataSource={data.slice(0, 1)} scrollY={400} columns={getColumns()} />
                </Modal>
            )}
        </div>
    );
};

const VirtualTableWithExpand = () => {
    const ExpandButton = React.useCallback(({onClick}: {onClick: () => void}) => {
        return <Button onClick={onClick}>Click Me</Button>;
    }, []);

    const rowExpand: VirtualTableRowExpand<Profile> = {
        width: 140,
        renderExpandRow: (record, rowIndex) => <div style={{padding: 30}}>Data {rowIndex + 1}</div>,
        ExpandButton,
        fixed: true,
    };
    return <VirtualTable rowKey="index" rowHeight={50} dataSource={data} scrollY={400} scrollX={800} columns={getColumns(true)} rowExpand={rowExpand} />;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "VirtualTable with huge amount of data",
        showPropsHint: false,
        components: [<VirtualTableWithData hasData />],
    },
    {
        title: "VirtualTable With Row Selection",
        showPropsHint: false,
        components: [<VirtualTableWithRowSelection />],
    },
    {
        title: "VirtualTable With Fixed Columns",
        showPropsHint: false,
        components: [<VirtualTableWithFixedColumns />],
    },
    {
        title: "VirtualTable with various amount of data",
        showPropsHint: false,
        components: [<VirtualTableWithVariousData />],
    },
    {
        title: "VirtualTable with various amount of data and row selection",
        showPropsHint: false,
        components: [<VirtualTableWithVariousDataAndRowSelection />],
    },
    {
        title: "VirtualTable inside Modal",
        showPropsHint: false,
        components: [<VirtualTableInModal />],
    },
    {
        title: "VirtualTable with expand",
        showPropsHint: false,
        components: [<VirtualTableWithExpand />],
    },
    {
        title: "VirtualTable without Data",
        showPropsHint: false,
        components: [<VirtualTableWithData />],
    },
    {
        title: "Loading VirtualTable",
        showPropsHint: false,
        components: [<LoadingVirtualTable />],
    },
];

export const VirtualTableDemo = () => <DemoHelper groups={groups} />;
