import { TabList } from "./TabList";
import { TabPanels } from "./TabPanels";
import { any, elementType, func, oneOfType, string } from "prop-types";
import { cssModule, mergeClasses } from "../../shared";
import { forwardRef } from "react";
import { useTabsBuilder } from "./useTabsBuilder";

/*
TODO:
- Tabs should support a render function.
*/

const propTypes = {
    /**
     * An HTML element type or a custom React element type to render as.
     */
    as: oneOfType([string, elementType]),
    /**
     * Component children.
     */
    children: oneOfType([any, func]).isRequired
};

export function InnerTabs({
    as: ElementType = "div",
    className,
    children,
    forwardedRef,
    ...rest
}) {
    const [headers, panels] = useTabsBuilder(children);

    return (
        <ElementType
            {...rest}
            className={mergeClasses(
                cssModule(
                    "o-ui-tabs"
                ),
                className
            )}
            ref={forwardedRef}
        >
            <TabList headers={headers} />
            <TabPanels panels={panels} />
        </ElementType>
    );
}

InnerTabs.propTypes = propTypes;

export const Tabs = forwardRef((props, ref) => (
    <InnerTabs {...props} forwardedRef={ref} />
));


