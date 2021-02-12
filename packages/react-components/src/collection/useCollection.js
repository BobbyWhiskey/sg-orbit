import { Children, useMemo } from "react";
import { Divider } from "../divider";
import { Item, Section } from "../placeholders";
import { TooltipTrigger, parseTooltipTrigger } from "../tooltip";
import { any, array, arrayOf, elementType, number, object, oneOfType, element as reactElement, string } from "prop-types";
import { isNil } from "lodash";
import { resolveChildren } from "../shared";

export const NodeShape = {
    key: string.isRequired,
    position: number.isRequired,
    index: number.isRequired,
    type: string.isRequired,
    elementType: elementType,
    ref: any,
    content: oneOfType([reactElement, arrayOf(reactElement), string]),
    props: object,
    items: array // Sections only
};

export const NodeType = {
    item: "item",
    section: "section",
    divider: "divider"
};

export class CollectionBuilder {
    _parseItem(element, position, nextIndex) {
        const { children, ...props } = element.props;

        const index = nextIndex();

        return {
            key: !isNil(element.key) ? element.key.replace(".", "").replace("$", "") : index.toString(),
            position,
            index,
            type: NodeType.item,
            // Use a custom type if available otherwise let the final component choose his type.
            elementType: element.type !== Item ? element.type : undefined,
            ref: element.ref,
            content: children,
            props
        };
    }

    _parseSection(element, position, nextIndex) {
        const { children, ...props } = element.props;

        const index = nextIndex();

        const that = this;

        const items = Children.map(resolveChildren(children), (x, childPosition) => that._parseItem(x, childPosition, nextIndex));

        return {
            key: index.toString(),
            position,
            index,
            type: NodeType.section,
            // Use a custom type if available otherwise let the final component choose his type.
            elementType: element.type !== Section ? element.type : undefined,
            ref: element.ref,
            content: null,
            props,
            items
        };
    }

    _parseDivider(element, position, nextIndex) {
        const { children, ...props } = element.props;

        const index = nextIndex();

        return {
            key: index.toString(),
            position,
            index,
            type: NodeType.divider,
            // Use a custom type if available otherwise let the final component choose his type.
            elementType: Divider,
            ref: element.ref,
            content: children,
            props
        };
    }

    _parseTooltip(element, position, nextIndex) {
        const { children, ...props } = element.props;

        const [item, tooltip] = parseTooltipTrigger(children);

        const parsedItem = this._parseItem(item, position, nextIndex);

        parsedItem.tooltip = {
            props,
            content: tooltip
        };

        return parsedItem;
    }

    build(children) {
        if (isNil(children)) {
            return [];
        }

        let index = 0;

        const elements = resolveChildren(children);

        const nextIndex = () => {
            return index++;
        };

        const that = this;

        return Children.map(elements, (element, position) => {
            switch (element.type) {
                case Section:
                    return that._parseSection(element, position, nextIndex);
                case Divider:
                    return that._parseDivider(element, position, nextIndex);
                case TooltipTrigger:
                    return that._parseTooltip(element, position, nextIndex);
                default:
                    return that._parseItem(element, position, nextIndex);
            }
        });
    }
}

export function useCollection(children) {
    const builder = useMemo(() => new CollectionBuilder(), []);

    return useMemo(() => builder.build(children), [builder, children]);
}
