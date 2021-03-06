import { Button } from "@react-components/button";
import { Toolbar } from "@react-components/toolbar";
import { createRef } from "react";
import { render, waitFor } from "@testing-library/react";

// ***** Accessibility *****

test("first element is tabbable", async () => {
    const { getByTestId } = render(
        <Toolbar>
            <Button data-testid="element-1">1</Button>
            <Button data-testid="element-2">2</Button>
        </Toolbar>
    );

    await waitFor(() => expect(getByTestId("element-1")).toHaveAttribute("tabindex", "0"));
    await waitFor(() => expect(getByTestId("element-2")).toHaveAttribute("tabindex", "-1"));
});

test("a disabled element is not tabbable", async () => {
    const { getByTestId } = render(
        <Toolbar>
            <Button disabled data-testid="element-1">1</Button>
            <Button data-testid="element-2">2</Button>
        </Toolbar>
    );

    expect(getByTestId("element-1")).not.toHaveAttribute("tabindex");
    await waitFor(() => expect(getByTestId("element-2")).toHaveAttribute("tabindex", "0"));
});

// ***** Refs *****

test("ref is a DOM element", async () => {
    const ref = createRef();

    render(
        <Toolbar ref={ref}><div>Hey!</div></Toolbar>
    );

    await waitFor(() => expect(ref.current).not.toBeNull());

    expect(ref.current instanceof HTMLElement).toBeTruthy();
    expect(ref.current.tagName).toBe("DIV");
});

test("when using a callback ref, ref is a DOM element", async () => {
    let refNode = null;

    render(
        <Toolbar
            ref={node => {
                refNode = node;
            }}
        >
            <div>Hey!</div>
        </Toolbar>
    );

    await waitFor(() => expect(refNode).not.toBeNull());

    expect(refNode instanceof HTMLElement).toBeTruthy();
    expect(refNode.tagName).toBe("DIV");
});

test("set ref once", async () => {
    const handler = jest.fn();

    render(
        <Toolbar ref={handler}>
            <div>Hey!</div>
        </Toolbar>
    );

    await waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
});
