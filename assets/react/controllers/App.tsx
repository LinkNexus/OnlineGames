import React from 'react';

interface Props {
    mercureUrl: string;
}
export default function ({ mercureUrl }: Props): React.ReactElement  {

    // React.useEffect(() => {
    //     const eventSource = new EventSource(JSON.parse(mercureUrl));
    //     eventSource.onmessage = (event) => {
    //         console.log(JSON.parse(event.data));
    //         const div = document.createElement('div');
    //         div.textContent = JSON.parse(event.data).status;
    //         ref.current.appendChild(div);
    //     }
    // });

    return (
        <div className='w-full'>
        </div>
    );
}