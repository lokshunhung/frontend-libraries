import React from "react";
import {Button} from "./Button";
import type {Props as FormProps} from "./Form";
import {Form} from "./Form";
import {i18n} from "../internal/i18n/core";
import type {PickOptional, SafeReactChildren} from "../internal/type";

// TODO: refactor this part:
//  1) remove this component, merge following into <Form>
//  2) <Form> add `hideSubmitButton?:bool`

export interface Props extends FormProps {
    children: SafeReactChildren;
    buttonText?: string;
    buttonDisabled?: boolean;
    buttonStyle?: React.CSSProperties;
    buttonRenderer?: (submitButton: React.ReactElement, isValidating: boolean) => React.ReactElement;
}

interface State {
    isValidating: boolean;
}

export class FormContainer extends React.PureComponent<Props, State> {
    static displayName = "FormContainer";
    static defaultProps: PickOptional<Props> = {
        buttonRenderer: submitButton => submitButton,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            isValidating: false,
        };
    }

    onValidationStatusChange = (isValidating: boolean) => {
        this.setState({isValidating});
        this.props.onValidationStatusChange?.(isValidating);
    };

    render() {
        const {buttonText, buttonDisabled, buttonStyle, buttonRenderer, children, ...formProps} = this.props;
        const {isValidating} = this.state;
        const t = i18n();
        const submitButton = (
            <Button className="g-form-submit-button" type="submit" style={buttonStyle} disabled={isValidating || buttonDisabled}>
                {buttonText || t.submit}
            </Button>
        );

        return (
            <Form onValidationStatusChange={this.onValidationStatusChange} {...formProps}>
                {children}
                <Form.Item className="g-form-submit-form-item">{buttonRenderer!(submitButton, isValidating)}</Form.Item>
            </Form>
        );
    }
}
