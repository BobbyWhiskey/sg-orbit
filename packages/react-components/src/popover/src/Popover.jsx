import { Children, forwardRef, useCallback, useState } from "react";
import { Overlay, useRestoreFocus } from "../../overlay";
import { PopoverContext } from "./PopoverContext";
import { any, arrayOf, bool, func, instanceOf, number, oneOf, oneOfType } from "prop-types";
import { augmentElement, mergeProps, resolveChildren, useAutoFocusChild, useEventCallback, useFocusManager, useFocusScope, useMergedRefs } from "../../shared";
import { isNil, isNumber } from "lodash";
import { usePopover } from "./usePopover";

const propTypes = {
    /**
     * Whether or not to show the overlay element.
     */
    show: bool,
    /**
     * The initial value of show when in auto controlled mode.
     */
    defaultShow: bool,
    /**
     * Position of the overlay element.
     */
    position: oneOf([
        "auto",
        "auto-start",
        "auto-end",
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "right",
        "right-start",
        "right-end",
        "left",
        "left-start",
        "left-end"
    ]),
    /**
     * Called when the popover visibility change.
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {boolean} isVisible - Indicate if the overlay is visible.
     * @returns {void}
     */
    onVisibilityChange: func,
    /**
     * Allow to displace the overlay from its trigger.
     * Ex: `[10, -10]`
     */
    offset: arrayOf(number),
    /**
     * Whether or not the overlay should hide on escape keydown.
     */
    hideOnEscape: bool,
    /**
     * Whether or not the overlay should hide on blur.
     */
    hideOnBlur: bool,
    /**
     * Whether or not to autofocus on show.
     */
    autoFocus: oneOfType([bool, number]),
    /**
     * Whether or not to restore the focus after the overlay is hidden.
     */
    restoreFocus: bool,
    /**
     * When true, disables automatic repositioning of the overlay, it will always be placed according to the position value.
     */
    pinned: bool,
    /**
     * Whether or not the overlay can flip when it will overflow it's boundary area.
     */
    allowFlip: bool,
    /**
     * Whether or not the overlay position can change to prevent it from being cut off so that it stays visible within its boundary area.
     */
    allowPreventOverflow: bool,
    /**
     * A DOM element in which the overlay element will be appended via a React portal.
     */
    containerElement: instanceOf(HTMLElement),
    /**
     * z-index of the overlay element.
     */
    zIndex: number,
    /**
     * React children.
     */
    children: oneOfType([any, func]).isRequired
};

export function InnerPopover({
    show,
    defaultShow,
    position = "bottom",
    onVisibilityChange,
    offset,
    hideOnEscape = true,
    hideOnBlur = true,
    autoFocus,
    restoreFocus = true,
    pinned,
    allowFlip = true,
    allowPreventOverflow = true,
    containerElement,
    zIndex,
    children,
    forwardedRef,
    ...rest
}) {
    const [triggerElement, setTriggerElement] = useState();
    const [overlayElement, setOverlayElement] = useState();

    const [focusScope, setFocusRef] = useFocusScope();

    const overlayRef = useMergedRefs(setOverlayElement, setFocusRef, forwardedRef);

    const { isVisible, setVisibility, triggerProps, overlayProps } = usePopover(triggerElement, overlayElement, "dialog", {
        show,
        defaultShow,
        onVisibilityChange,
        hideOnEscape,
        hideOnBlur,
        hideOnOutsideClick: !hideOnBlur || !autoFocus,
        position,
        offset,
        allowFlip,
        allowPreventOverflow,
        pinned,
        boundaryElement: containerElement,
        zIndex
    });

    const hide = useCallback(event => {
        setVisibility(event, false);
    }, [setVisibility]);

    const [trigger, content] = Children.toArray(resolveChildren(children, { isVisible, hide }));

    if (isNil(trigger) || isNil(content)) {
        throw new Error("A popover must have exactly 2 children.");
    }

    const focusManager = useFocusManager(focusScope);

    const restoreFocusProps = useRestoreFocus(focusScope, { isDisabled: !restoreFocus || !isVisible });

    useAutoFocusChild(
        focusManager,
        {
            isDisabled: !autoFocus || !isVisible,
            delay: isNumber(autoFocus) ? autoFocus : undefined,
            onNotFound: useEventCallback(() => {
                // Focusing on the overlay enable closing on blur and esc key.
                overlayElement?.focus();
            })
        });

    const triggerMarkup = augmentElement(trigger, {
        ...triggerProps,
        ref: setTriggerElement
    });

    return (
        <>
            {triggerMarkup}
            <Overlay
                {...mergeProps(
                    rest,
                    overlayProps,
                    restoreFocusProps,
                    {
                        show: isVisible,
                        className: "o-ui-popover",
                        containerElement,
                        ref: overlayRef
                    }
                )}
            >
                <PopoverContext.Provider
                    value={{
                        isVisible,
                        hide
                    }}
                >
                    {content}
                </PopoverContext.Provider>
            </Overlay>
        </>
    );
}

InnerPopover.propTypes = propTypes;

export const Popover = forwardRef((props, ref) => (
    <InnerPopover {...props} forwardedRef={ref} />
));

Popover.displayName = "Popover";
