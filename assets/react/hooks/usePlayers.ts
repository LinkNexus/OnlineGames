import React from "react";
import User from "@/react/interfaces/user";

// Constants
const CONTENT_TYPE_JSON = 'application/json';

export default (players: User[], setPlayers: React.Dispatch<React.SetStateAction<User[]>>, url: string, opponentPlayer: User | null) => {
    const [errors, setErrors] = React.useState(null);

    React.useEffect(() => {
        if (players.length === 2 && !opponentPlayer) {
            fetch('/api/players/synchronize', {
                method: 'POST',
                headers: {
                    'Content-Type': CONTENT_TYPE_JSON,
                },
                body: JSON.stringify(players),
            })
                .catch(e => setErrors(e));
        }

        const eventSource = new EventSource(JSON.parse(url));
        eventSource.onmessage = (event) => {
            setPlayers(JSON.parse(event.data));
        };

        return () => eventSource.close();
    }, [players, url]);

    return {errors};
}