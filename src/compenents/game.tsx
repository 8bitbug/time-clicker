import Clock from './clock';
import { useState, useEffect } from 'react';

function Game() {
    const savedGame = JSON.parse(localStorage.getItem('savedGame') || '{}');

    const [game, setGame] = useState(() => {
        const second: number = savedGame.second || 0;
        const minute: number = Math.ceil(second / 60);
        const hour: number = Math.ceil(minute / 60);

        const clickRate: number = 1;

        return {
            second,
            minute,
            hour,
            clickRate,
        };
    });

    const increment = () => {
        setGame((prevGame) => {
            const newClickRate: number = 1;
            const newSecond: number = prevGame.second + newClickRate;
            const newMinute: number = Math.floor(newSecond / 60);
            const newHour: number = Math.floor(newMinute / 60);

            const updatedGame = {
                second: newSecond,
                minute: newMinute,
                hour: newHour,
                clickRate: newClickRate,
            };

            save(updatedGame);
            return updatedGame;
        });
    };

    const save = (updatedGame: { second: number; minute: number; hour: number }) => {
        localStorage.setItem('savedGame', JSON.stringify(updatedGame));
    };

    return (
        <Clock second={game.second} minute={game.minute} hour={game.hour} onClick={increment} />
    );
}

export default Game;