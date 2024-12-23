import React from "react";

export default (initialValue: boolean = false): [boolean, () => void] => {
    const [state, setState] = React.useState<boolean>(initialValue);
    const toggle = () => setState(value => !value);

    return [state, toggle];
}