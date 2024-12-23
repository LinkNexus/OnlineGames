import React from 'react';
import User from "@/react/interfaces/user";
import waitingQueue from "@/react/components/game/waiting-queue";
import WaitingQueue from "@/react/components/game/waiting-queue";

// Interfaces

interface Props {
    joinUrl: string;
    user: User;
    synchronizePlayersUrl: string;
    isPlayerReadyUrl: string;
}

function handleGridClick(this: HTMLDivElement): void {
    const span = document.createElement('span');
    span.innerText = 'X';
    this.appendChild(span);
}

// Main Component
// function GameComponent(): React.ReactElement {
//     const gridContainerRef = React.useRef<HTMLDivElement>(null);
//     const [players, setPlayers] = React.useState<User[]>([]);
//
//     console.log(players);
//
//     React.useEffect(() => {
//         sendUserJoinRequest(user);
//         const eventSource = initializeJoinEventSource(joinUrl, setPlayers);
//
//         console.log(players);
//         return () => eventSource.close();
//     }, [joinUrl, user]);
//
//     // Always call the custom hook and let it handle the internal logic
//     const {data} = usePlayers(players, choosePlayersUrl);
//     console.log(data);
//
//     React.useEffect(() => {
//         const gridContainer = gridContainerRef.current;
//         if (gridContainer) {
//             for (const grid of gridContainer.children) {
//                 grid.addEventListener('click', handleGridClick);
//             }
//             return () => {
//                 for (const grid of gridContainer.children) {
//                     grid.removeEventListener('click', handleGridClick);
//                 }
//             };
//         }
//     }, []);
//
//     return (
//         <div className="w-full h-screen flex flex-wrap flex-col content-center justify-center">
//             <div ref={gridContainerRef} className="grids w-fit p-10 rounded-lg">
//                 {[...Array(9)].map((_, idx) => (
//                     <div key={idx} id={(idx + 1).toString()}></div>
//                 ))}
//             </div>
//         </div>
//     );
// }

export default function ({joinUrl, user, synchronizePlayersUrl, isPlayerReadyUrl}: Props): React.ReactElement {
    return (
        <div className='w-full h-screen'>
            <WaitingQueue
                user={user}
                joinUrl={joinUrl}
                synchronizePlayersUrl={synchronizePlayersUrl}
                isPlayerReadyUrl={isPlayerReadyUrl}
            />
        </div>
    );
}