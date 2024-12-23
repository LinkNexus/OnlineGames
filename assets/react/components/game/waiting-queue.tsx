import React from 'react';
import Spinner from "@/react/components/utilities/spinner";
import User from "@/react/interfaces/user";
import usePlayers from "@/react/hooks/usePlayers";
import useToggle from "@/react/hooks/useToggle";

enum OpponentStatus {
    IN_SEARCH = 'Waiting for other players...',
    FOUND = 'Opponent found!',
    READY = 'Opponent is ready to play!',
}

// Helper Functions
function sendUserJoinRequest(user: User): void {
    fetch('/api/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }).catch(error => console.error(`Error: ${error.message}`));
}

function initializeJoinEventSource(joinUrl: string, setPlayers: React.Dispatch<React.SetStateAction<User[]>>): EventSource {
    const eventSource = new EventSource(JSON.parse(joinUrl));
    eventSource.onmessage = (event) => {
        const player = JSON.parse(event.data);
        setPlayers((prevPlayers): User[] => [...prevPlayers, player]);
    };
    return eventSource;
}

const checkOpponentState = (opponent: User | null, isReady: boolean) => {
    if (opponent) {
        return isReady ? OpponentStatus.READY : OpponentStatus.FOUND;
    }
    return OpponentStatus.IN_SEARCH;
}

interface Props {
    joinUrl: string;
    user: User;
    synchronizePlayersUrl: string;
    isPlayerReadyUrl: string;
}

export default function ({user, joinUrl, synchronizePlayersUrl, isPlayerReadyUrl}: Props): React.ReactElement {
    const [players, setPlayers] = React.useState<User[]>([]);
    const [opponentPlayer, setOpponentPlayer] = React.useState<User | null>(null);
    const [isReady, toggleIsReady] = useToggle(true);
    const [isOpponentReady, setIsOpponentReady] = React.useState<boolean>(false);

    React.useEffect(() => {
        sendUserJoinRequest(user);
        const eventSource = initializeJoinEventSource(joinUrl, setPlayers);

        return () => eventSource.close();
    }, [joinUrl, user]); // Dependency array ensures this runs only when `joinUrl` or `user` change.

    usePlayers(players, setPlayers, synchronizePlayersUrl, opponentPlayer);

    React.useEffect(() => {
        if (players.length === 2) {
            const newOpponent = players.find((player) => player.id !== user.id) || null;
            setOpponentPlayer(newOpponent);
        }
    }, [players, user.id]); // Only runs when `players` or `user.id` changes.

    React.useEffect(() => {
        const eventSource = new EventSource(JSON.parse(isPlayerReadyUrl));
        eventSource.onmessage = (event) => {
            console.log(JSON.parse(event.data));
            const {user: currentUser, isReady: isCurrentUserReady}: {user: User, isReady: boolean} = JSON.parse(event.data);
            if (currentUser.id !== user.id) {
                setIsOpponentReady(isCurrentUserReady);
            }
        };

        return () => eventSource.close();
    }, [isReady]);

    const updateCheckedStatus = () => {
        toggleIsReady();

        fetch('/api/players/is-ready', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user, isReady})
        }).catch(error => console.error(`Error: ${error.message}`));
    }

    return (
        <div className='w-full h-full flex'>
            <div className='queue-side border-r-2 border-slate-300'>
                <div className='image'>
                    <img src={`/images/${user.image}`} alt='profile-image'/>
                </div>
                <div className='header'>
                    <h1>Player: {user.username}</h1>
                    <span>{checkOpponentState(opponentPlayer, isOpponentReady)}</span>
                </div>

                {opponentPlayer && <div className='mt-5 flex gap-x-2'>
                    <input checked={!isReady} onChange={updateCheckedStatus} type='checkbox' id='ready' />
                    <label className='font-semibold' htmlFor='ready'>Ready?</label>
                </div>}
            </div>

            <div className='queue-side'>
                {!opponentPlayer && <Spinner />}

                {opponentPlayer && (
                    <>
                        <div className='image'>
                            <img src={`/images/${opponentPlayer.image}`} alt='profile-image'/>
                        </div>
                        <div className='header'>
                            <h1>Opponent: {opponentPlayer.username}</h1>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}