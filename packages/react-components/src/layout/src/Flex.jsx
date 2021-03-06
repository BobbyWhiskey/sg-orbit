import "./Flex.css";

import { Box } from "../../box";
import { any, bool, elementType, oneOf, oneOfType, string } from "prop-types";
import { cssModule, mergeProps } from "../../shared";
import { forwardRef } from "react";
import { isNil, isString } from "lodash";
import { useMemo } from "react";

const propTypes = {
    /**
     * How the elements are placed in the container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction).
     */
    direction: oneOf(["row", "column"]),
    /**
     * Whether or not to inline the elements.
     */
    inline: bool,
    /**
     * Whether or not to reverse the order of the elements.
     */
    reverse: bool,
    /**
     * The distribution of space around child items along the cross axis. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content).
     */
    alignContent: oneOf([
        "start",
        "end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
        "stretch",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center"
    ]),
    /**
     * The alignment of children within their container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items).
     */
    alignItems: oneOf([
        "start",
        "end",
        "center",
        "stretch",
        "self-start",
        "self-end",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center"
    ]),
    /**
     * The distribution of space around items along the main axis. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content).
     */
    justifyContent: oneOf([
        "start",
        "end",
        "center",
        "left",
        "right",
        "space-between",
        "space-around",
        "space-evenly",
        "stretch",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center"
    ]),
    /**
     * The space between both rows and columns. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/gap).
     */
    gap: oneOfType([oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), string]),
    /**
     * Whether flex items are forced onto one line or can wrap onto multiple lines. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap).
     */
    wrap: oneOf(["nowrap", "wrap", "wrap-reverse"]),
    /**
     * Whether the elements take up all the space of their container.
     */
    fluid: bool,
    /**
     * Whether to wrap children in a `div` element.
     */
    wrapChildren: bool,
    /**
     * An HTML element type or a custom React element type to render as.
     */
    as: oneOfType([string, elementType]),
    /**
     * @ignore
     */
    children: any.isRequired
};

const Spacing = [
    "--o-ui-scale-alpha",
    "--o-ui-scale-bravo",
    "--o-ui-scale-charlie",
    "--o-ui-scale-delta",
    "--o-ui-scale-echo",
    "--o-ui-scale-foxtrot",
    "--o-ui-scale-golf",
    "--o-ui-scale-hotel",
    "--o-ui-scale-india",
    "--o-ui-scale-juliett",
    "--o-ui-scale-kilo",
    "--o-ui-scale-lima",
    "--o-ui-scale-mike"
];

// @supports doesn't work for flexbox-gap.
function useIsGapSupported(noGap) {
    return useMemo(() => {
        if (noGap) {
            return false;
        }

        const element = document.createElement("DIV");

        element.innerHTML = `
            <div id="o-ui-flex-gap-support" style="display: inline-flex; gap: 1px; visibility: hidden">
                <div style="width: 1px"></div>
                <div style="width: 1px"></div>
            </div>
        `;

        document.body.appendChild(element);

        const width = document.getElementById("o-ui-flex-gap-support").clientWidth;

        document.body.removeChild(element);

        return width === 3;
    }, [noGap]);
}

export function InnerFlex({
    direction,
    inline,
    reverse,
    alignContent,
    alignItems,
    justifyContent,
    gap,
    wrap,
    fluid,
    noGap,
    children,
    forwardedRef,
    ...rest
}) {
    const isGapSupported = useIsGapSupported(noGap);

    // Normalize values until Chrome support `start` & `end`, https://developer.mozilla.org/en-US/docs/Web/CSS/align-items.
    alignContent = alignContent && alignContent.replace("start", "flex-start").replace("end", "flex-end");
    alignItems = alignItems && alignItems.replace("start", "flex-start").replace("end", "flex-end");
    justifyContent = justifyContent && justifyContent.replace("start", "flex-start").replace("end", "flex-end");

    const items = children;

    return (
        <Box
            {...mergeProps(
                rest,
                {
                    className: cssModule(
                        "o-ui-flex",
                        direction || "row",
                        inline && "inline",
                        reverse && "reverse",
                        fluid && "fluid",
                        !isGapSupported && "no-gap"
                    ),
                    style: {
                        flexDirection: direction && `${direction}${reverse ? "-reverse" : ""}`,
                        alignContent: alignContent,
                        alignItems: alignItems,
                        justifyContent: justifyContent,
                        flexWrap: !isNil(wrap) ? "wrap" : undefined,
                        "--o-ui-gap": gap && (isString(gap) ? gap : `var(${Spacing[(gap) - 1]})`)
                    },
                    ref: forwardedRef
                }
            )}
        >
            {items}
        </Box>
    );
}

InnerFlex.propTypes = propTypes;

export const Flex = forwardRef((props, ref) => (
    <InnerFlex {...props} forwardedRef={ref} />
));
