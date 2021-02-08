import { omitProps } from "../../shared";
import React, { ReactNode, Ref, forwardRef } from "react";

interface Slottable {
    /**
     * [Slot](?path=/docs/getting-started-slots--page) to render into.
     */
    slot?: string;
}

interface ForwardedComponent<T> {
    // @ignore
    forwardedRef?: Ref<T>;
}

type PropsOf<TTag = any> = TTag extends React.ElementType
    ? React.ComponentProps<TTag>
    : never

type ExtractHtmlType<T> = T extends React.ClassAttributes<infer U> ? U : T;
type AsProperty<T extends React.ElementType> = {
    as?: T;
} & PropsOf<ExtractHtmlType<T>>;


type BoxProps<T extends React.ElementType = "div"> = {
    children?: ReactNode;
} & Slottable & AsProperty<T> & ForwardedComponent<ExtractHtmlType<T>>


export function InnerBox<T extends React.ElementType>(props: BoxProps<T>) {
    const {
        as: ElementType,
        children,
        forwardedRef,
        ...rest
    } = omitProps(props, ["slot"]);

    return (
        <ElementType
            {...rest}
            ref={forwardedRef}
        >
            {children}
        </ElementType>
    );
}

export const Box = forwardRef<ExtractHtmlType<"div">, BoxProps<"div">>((props, ref) => (
    <InnerBox {...props} forwardedRef={ref} />
));


const test = (<Box as="input" onClick={undefined} />);
const test2 = (<InnerBox as="input" onClick={undefined} />);

Box.displayName = "Box";


