import "./TextButton.css";

import { Box } from "../../box";
import { Text } from "../../text";
// import { any, bool, elementType, func, number, oneOf, oneOfType, string } from "prop-types";
import { createSizeAdapter, cssModule, mergeClasses, mergeProps, omitProps, slot, useSlots } from "../../shared";
import { embeddedIconSize } from "../../icons";
import { ReactNode, forwardRef, useMemo, SyntheticEvent, ComponentType } from "react";
import { useButton } from "./useButton";
import { useFormButton } from "../../form";
import { useToolbarProps } from "../../toolbar";

interface ButtonProps {
    /**
     * The button style to use.
     */
    variant?: "solid" | "outline" | "ghost";
    /**
     * The button color accent.
     */
    color?: "primary" | "secondary" | "danger" | "inherit";
    /**
     * The button shape.
     */
    shape?: "pill" | "rounded" | "circular";
    /**
     * Whether or not the button content should takes additional space.
     */
    condensed?: boolean;
    /**
     * Whether or not the button should autoFocus on render.
     */
    autoFocus?: boolean;
    /**
     * The delay before trying to autofocus.
     */
    autoFocusDelay?: number;
    /**
     * Whether the button take up the width of its container.
     */
    fluid?: boolean;
    /**
     * A button can show a loading indicator.
     */
    loading?: boolean;
    /**
     * A button can vary in size.
     */
    size?: "sm" | "md";
    /**
     * Whether or not the button is disabled.
     */
    disabled?: boolean;
    /**
     * The button type.
     */
    type?: "button" | "submit" | "reset";
    /**
     * Called when the button is click.
     */
    onClick?(e: SyntheticEvent): void;
    /**
     * An HTML element type or a custom React element type to render as.
     */
    as?: string | ComponentType;
    /**
     * Default slot override.
     */
    slot?: string;
    /**
     * React children.
     */
    children: ReactNode;

    forwardedRef: React.ForwardedRef<unknown>
};

const condensedTextSize = createSizeAdapter({
    "sm": "md",
    "md": "lg"
});

export function InnerButton(props: ButtonProps) {
    const [formProps] = useFormButton();
    const [toolbarProps] = useToolbarProps();

    const {
        variant = "solid",
        color,
        shape = "pill",
        condensed,
        autoFocus,
        autoFocusDelay,
        fluid,
        loading,
        size,
        active,
        focus,
        hover,
        type = "button",
        as = "button",
        className,
        children,
        forwardedRef,
        ...rest
    } = mergeProps(
        props,
        formProps,
        omitProps(toolbarProps, ["orientation"])
    ) as any;

    const { className: buttonClassName, ref: buttonRef, ...buttonProps } = useButton({
        cssModule: "o-ui-text-button",
        variant,
        color,
        shape,
        autoFocus,
        autoFocusDelay,
        fluid,
        loading,
        size,
        active,
        focus,
        hover,
        type,
        className,
        forwardedRef
    });

    const { icon, text, "right-icon": rightIcon } = useSlots(children, useMemo(() => ({
        _: {
            defaultWrapper: Text
        },
        icon: {
            size: condensed ? size : embeddedIconSize(size),
            className: "o-ui-button-left-icon"
        },
        text: {
            size: condensed ? condensedTextSize(size) : size,
            className: "o-ui-button-text",
            "aria-hidden": loading
        },
        "right-icon": {
            size: condensed ? size : embeddedIconSize(size),
            className: "o-ui-button-right-icon"
        }
    }), [size, condensed, loading])) as any;

    return (
        <Box
            {...rest}
            {...buttonProps}
            className={mergeClasses(
                cssModule(
                    "o-ui-button",
                    rightIcon && "has-right-icon",
                    icon && "has-left-icon"
                ),
                buttonClassName
            )}
            as={as}
            ref={buttonRef}
        >
            {icon}
            {text}
            {rightIcon}
        </Box>
    );
}

export const Button = slot("button", forwardRef((props: Omit<ButtonProps, "forwardedRef">, ref) => (
    <InnerButton {...props} forwardedRef={ref} />
)));

Button.displayName = "Button";


