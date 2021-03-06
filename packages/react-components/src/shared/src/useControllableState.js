import { isFunction, isUndefined } from "lodash";
import { useCallback, useRef } from "react";
import { useRefState } from "./useRefState";

function validatePrerequisites(controlledValue, initialValue) {
    if (!isUndefined(controlledValue) && !isUndefined(initialValue)) {
        throw new Error(
            "useControllableState - A controllable state value can either have a controlled value or an initial value, but not both."
        );
    }
}

function ensureControlledStateHaveNotChanged(controlledValue, isControlled) {
    if ((isControlled && isUndefined(controlledValue)) || (!isControlled && !isUndefined(controlledValue))) {
        throw new Error("useControllableState - A controllable state value cannot switch between controlled and uncontrolled. Did you inadvertently set a default value (defaultProps) for your controlled prop?");
    }
}

function useComputeInitialState(controlledValue, initialValue, defaultValue) {
    const result = (state, isControlled, isInitialState = false) => ({ state, isControlled, isInitialState });

    const hasComputedRef = useRef(false);

    if (hasComputedRef.current) {
        return result(null, null);
    }

    let state;
    let isControlled = false;

    if (isUndefined(controlledValue)) {
        // This prop is "uncontrolled".
        state = !isUndefined(initialValue) ? initialValue : defaultValue;
    } else {
        // This prop is "controlled".
        state = controlledValue;
        isControlled = true;
    }

    hasComputedRef.current = true;

    return result(state, isControlled, true);
}

function computeSubsequentState(controlledValue, currentState, isControlled) {
    let newState = null;
    let hasChanged = false;

    ensureControlledStateHaveNotChanged(controlledValue, isControlled);

    if (isControlled) {
        if (currentState !== controlledValue) {
            newState = controlledValue;
            hasChanged = true;
        }
    }

    return {
        newState,
        hasChanged
    };
}

/**
 * This implementation is a port of Semantic UI React "AutoControlledComponent" base component to hooks: https://github.com/Semantic-Org/Semantic-UI-React/blob/master/src/lib/AutoControlledComponent.js.
 * The goal is to seemlessly support "controlled" and "uncontrolled" component behaviors by abstracting the complexity in this hook.
 * This is achieved by abstracting the state and updating a state value only when a prop is considered "uncontrolled".
 *
 * @param {Object} controlledValue - The controlled value.
 * @param {Object} initialValue - The initial value.
 * @param {Object} defaultValue - The default value.
 * @param {Object} [options] - A set of optionnal options.
 * @returns {[Object, Function]} An array with the first value being the value of the state and the second value being a function to manually update the state value.
 * @example
 * const [controllableValue, setUncontrolledState] = useControllableState(value, initialValue, defaultValue, {
 *    onChange: (newValue, isInitialState) => {
 *       // Optionally compute derived state...
 *       if (isInitialState) {
 *           setSelectedValue(newValue)
 *       }
 *    }
 * });
 *
 * ...
 *
 * setUncontrolledState("Neil Armstrong");
 */
export function useControllableState(controlledValue, initialValue, defaultValue, { onChange } = {}) {
    validatePrerequisites(controlledValue, initialValue);

    let { state: initialState, isControlled: isControlledProp, isInitialState } = useComputeInitialState(controlledValue, initialValue, defaultValue);

    const [isControlledRef] = useRefState(isControlledProp);

    const transformState = useCallback((newState, context) => {
        const transformedState = isFunction(onChange)
            ? onChange(newState, { ...context, isControlled: isControlledRef.current })
            : undefined;

        return !isUndefined(transformedState)
            ? transformedState
            : newState;
    }, [isControlledRef, onChange]);

    if (isInitialState) {
        initialState = transformState(initialState, { isInitial: true });
    }

    // Using a ref instead of useState because when in controlled mode the consumer must already have is own state management code and
    // using useState here would cause 2 rerender when the controlled value update.
    const [stateRef, setState] = useRefState(initialState);

    if (!isInitialState) {
        const { newState, hasChanged } = computeSubsequentState(controlledValue, stateRef.current, isControlledRef.current);

        if (hasChanged) {
            setState(transformState(newState, { isInitial: false }));
        }
    }

    /**
     * Safely attempt to set state for a prop that might be "controlled" by the consumer.
     * When the prop is "uncontrolled", the state will be updated with the value, otherwise ignored.
     */
    const setUncontrolledState = useCallback(maybeState => {
        if (!isControlledRef.current) {
            if (maybeState !== stateRef.current) {
                setState(transformState(maybeState, { isInitial: false }), true);
            }
        }
    }, [stateRef, setState, isControlledRef, transformState]);

    return [stateRef.current, setUncontrolledState, isControlledProp];
}
