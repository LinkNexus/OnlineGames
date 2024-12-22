import React from 'react';

// Constants
const CONTENT_TYPE_JSON = 'application/json';

// Interfaces
interface User {
    id: number;
    username: string;
    email: string;
}

interface Props {
    joinUrl: string;
    user: User;
    choosePlayersUrl: string;
}

// Helper Functions
function sendUserJoinRequest(user: User): void {
    fetch('/api/join', {
        method: 'POST',
        headers: {
            'Content-Type': CONTENT_TYPE_JSON,
        },
        body: JSON.stringify(user),
    }).catch(error => console.error(`Error: ${error.message}`));
}

function initializeJoinEventSource(joinUrl: string, setPlayers: React.Dispatch<React.SetStateAction<User[]>>): EventSource {
    const eventSource = new EventSource(JSON.parse(joinUrl));
    eventSource.onmessage = (event) => {
        const {message, player} = JSON.parse(event.data);
        alert(message);
        setPlayers((prevPlayers) => [...prevPlayers, player]);
    };
    return eventSource;
}

function handleGridClick(this: HTMLDivElement): void {
    const span = document.createElement('span');
    span.innerText = 'X';
    this.appendChild(span);
}

// Custom Hooks
function usePlayers(players: User[], url: string) {
    const [data, setData] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (players.length === 2) {
            fetch('/api/choose-players', {
                method: 'POST',
                headers: {
                    'Content-Type': CONTENT_TYPE_JSON,
                },
                body: JSON.stringify(players),
            }).catch((fetchError) => setError(fetchError));
        }

        const eventSource = new EventSource(JSON.parse(url));
        eventSource.onmessage = (event) => {
            setData(JSON.parse(event.data));
        };

        return () => eventSource.close();
    }, [players, url]);

    return {data, error};
}

// Main Component
function GameComponent({joinUrl, user, choosePlayersUrl}: Props): React.ReactElement {
    const gridContainerRef = React.useRef<HTMLDivElement>(null);
    const [players, setPlayers] = React.useState<User[]>([]);

    console.log(players);

    React.useEffect(() => {
        sendUserJoinRequest(user);
        const eventSource = initializeJoinEventSource(joinUrl, setPlayers);

        console.log(players);
        return () => eventSource.close();
    }, [joinUrl, user]);

    // Always call the custom hook and let it handle the internal logic
    const {data} = usePlayers(players, choosePlayersUrl);
    console.log(data);

    React.useEffect(() => {
        const gridContainer = gridContainerRef.current;
        if (gridContainer) {
            for (const grid of gridContainer.children) {
                grid.addEventListener('click', handleGridClick);
            }
            return () => {
                for (const grid of gridContainer.children) {
                    grid.removeEventListener('click', handleGridClick);
                }
            };
        }
    }, []);

    return (
        <div className="w-full h-screen flex flex-wrap flex-col content-center justify-center">
            <div ref={gridContainerRef} className="grids w-fit p-10 rounded-lg">
                {[...Array(9)].map((_, idx) => (
                    <div key={idx} id={(idx + 1).toString()}></div>
                ))}
            </div>
        </div>
    );
}

function waitingQueue(): React.ReactElement {
    return (
        <div></div>
    )
}

export default function (): React.ReactElement {
    return (
        waitingQueue()
    );
}