import React from 'react';

interface Props {
    mercureUrl: string;
}
export default function ({ mercureUrl }: Props): React.ReactElement  {
    const ref = React.useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    React.useEffect(() => {
        const eventSource = new EventSource(JSON.parse(mercureUrl));
        eventSource.onmessage = (event) => {
            console.log(JSON.parse(event.data));
            const div = document.createElement('div');
            div.textContent = JSON.parse(event.data).status;
            ref.current.appendChild(div);
        }
    });

    return <div>
        <div ref={ref}></div>
        <form action='/publish' method='POST'>
            <button type='submit'>Ping!</button>
        </form>
    </div>;
}