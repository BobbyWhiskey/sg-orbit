import { FieldMessage, getValidationProps } from "./FieldMessage";
import { any, elementType, oneOf, oneOfType, string } from "prop-types";
import { forwardRef } from "react";
import { mergeProps } from "../../shared";
import { useFieldMessageProps } from "./FieldContext";

const propTypes = {
    /**
     * A message can vary in size.
     */
    size: oneOf(["sm", "md"]),
    /**
     * An HTML element type or a custom React element type to render as.
     */
    as: oneOfType([string, elementType]),
    /**
     * React children.
     */
    children: any.isRequired
};

export function InnerHelpMessage(props) {
    const [{ validationState, ...messageProps }, isInField] = useFieldMessageProps();

    const { isHelp } = getValidationProps(validationState);

    const {
        forwardedRef,
        children,
        ...rest
    } = mergeProps(props, messageProps);

    if (isInField && !isHelp) {
        return null;
    }

    return (
        <FieldMessage
            {...rest}
            tone="neutral"
            ref={forwardedRef}
        >
            {children}
        </FieldMessage>
    );
}

InnerHelpMessage.propTypes = propTypes;

export const HelpMessage = forwardRef((props, ref) => (
    <InnerHelpMessage {...props} forwardedRef={ref} />
));

HelpMessage.displayName = "HelpMessage";
