import React from "react";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {NumberInput, Props as NumberInputProps} from "@pinnacle0/web-ui/core/NumberInput";
import {Props as NumberInputPercentageProps} from "@pinnacle0/web-ui/core/NumberInput/NumberInputPercentage";
import {DemoHelper, DemoHelperGroupConfig} from "../../DemoHelper";
import {AuthenticationCodeInput} from "@pinnacle0/web-ui/core/AuthenticationCodeInput";
import {dummyEmptyCallback} from "test/ui-test/util/dummyCallback";
import {withUncontrolledInitialValue} from "test/ui-test/util/withUncontrolledInitialValue";
import {TagInput} from "@pinnacle0/web-ui/core/TagInput";

const UncontrolledTagInput = () => {
    const parser = (text: string) => text.split(/[\n ,;]/g).filter(Boolean);
    const [input, setInput] = React.useState<string[]>([]);
    return <TagInput parser={parser} value={input} onChange={setInput} disabled />;
};

const NullableNumberInput = (props: Omit<NumberInputProps<true>, "value" | "onChange" | "allowNull">) => {
    const [value, onChange] = React.useState<number | null>(null);
    return <NumberInput {...props} value={value} onChange={onChange} allowNull />;
};

const RequiredNumberInput = ({initialValue, ...props}: Omit<NumberInputProps<false>, "value" | "onChange" | "allowNull"> & {initialValue: number}) => {
    const [value, onChange] = React.useState<number>(initialValue);
    return <NumberInput {...props} value={value} onChange={onChange} allowNull={false} />;
};

const RequiredNumberInputPercentage = ({initialValue, ...props}: Omit<NumberInputPercentageProps<false>, "value" | "onChange" | "allowNull"> & {initialValue: number}) => {
    const [value, onChange] = React.useState<number>(initialValue);
    return <NumberInput.Percentage {...props} value={value} onChange={onChange} allowNull={false} />;
};

const UncontrolledInput = withUncontrolledInitialValue(Input);

const PasswordInput = withUncontrolledInitialValue(Input.Password);

const NullableInput = withUncontrolledInitialValue(Input.Nullable);

const TextArea = withUncontrolledInitialValue(Input.TextArea);

const NullableTextArea = withUncontrolledInitialValue(Input.NullableTextArea);

const onNumberChange = (_: number) => {};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Basic",
        components: [<UncontrolledInput initialValue="" />, <UncontrolledInput initialValue="" prefix="before" suffix="after" />, <PasswordInput initialValue="" />],
    },
    {
        title: "Nullable Input",
        components: [<NullableInput initialValue={null} />],
    },
    {
        title: "Required Number Input",
        components: [
            <RequiredNumberInput scale={0} editable={false} stepperMode="always" step={1} initialValue={10} />,
            <RequiredNumberInput scale={0} stepperMode="always" step={1} initialValue={10} />,
            <RequiredNumberInput scale={1} stepperMode="always" step={0.2} initialValue={10} />,
            <RequiredNumberInput scale={2} min={0} max={100} stepperMode="always" step={0.05} initialValue={3.88} />,
            "-",
            <RequiredNumberInput scale={2} stepperMode="always" step={0.05} initialValue={4} displayRenderer={_ => "<" + _ + ">"} />,
            <RequiredNumberInput scale={2} initialValue={4} suffix={<FileSearchOutlined />} />,
            <RequiredNumberInput scale={2} stepperMode="always" step={0.05} initialValue={4} suffix="After" />,
            <RequiredNumberInput scale={2} stepperMode="hover" step={0.05} initialValue={4} suffix="After" />,
        ],
    },
    {
        title: "Nullable Number Input",
        components: [
            <NullableNumberInput scale={0} stepperMode="always" />,
            <NullableNumberInput scale={0} stepperMode="hover" />,
            <NullableNumberInput scale={3} />,
            <NullableNumberInput scale={0} disabled />,
            <NullableNumberInput scale={0} placeholder="Here..." />,
            "-",
            <NullableNumberInput scale={0} inputStyle={{width: 400, border: "2px solid blue", color: "blue"}} />,
        ],
    },
    {
        title: "Dollar Number Input",
        components: [
            <NumberInput.Dollar scale={2} min={0} onChange={onNumberChange} value={9999} allowNull={false} />,
            <NumberInput.Dollar
                stepperMode="always"
                scale={2}
                min={0}
                // @ts-expect-error
                onChange={onNumberChange}
                value={9999.888}
                allowNull
            />,
        ],
    },
    {
        title: "Percentage Number Input",
        components: [
            <RequiredNumberInputPercentage initialValue={0.4} percentageScale={0} stepperMode="none" />,
            <RequiredNumberInputPercentage initialValue={0.5} percentageScale={1} stepperMode="hover" />,
            <RequiredNumberInputPercentage initialValue={0.6} percentageScale={2} stepperMode="always" />,
        ],
    },
    {
        title: "Text Area",
        components: [<TextArea initialValue="Text Area Content" disabled />, <NullableTextArea initialValue={null} />],
    },
    {
        title: "Authentication Code Input",
        components: [<AuthenticationCodeInput onSend={() => new Promise<void>(resolve => setTimeout(() => resolve(), 500))} value="" onChange={dummyEmptyCallback} nextSendInterval={5} />],
    },
    {
        title: "Tags Input",
        components: [<UncontrolledTagInput />],
    },
];

export const InputDemo = () => <DemoHelper groups={groups} />;
