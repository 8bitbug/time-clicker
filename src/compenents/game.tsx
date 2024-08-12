import Clock from './clock';
import React, { useState, useEffect } from 'react';
import '../App.css';

function Game(): JSX.Element {
    const savedGame = JSON.parse(localStorage.getItem('savedGame') || '{}');

    const [game, setGame] = useState(() => {
        const second: number = savedGame.second || 0;
        const minute: number = Math.floor(second / 60);
        const hour: number = Math.floor(minute / 60);
        const day: number = Math.floor(hour / 24);
        const week: number = Math.floor(day / 7);
        const month: number = Math.floor(week / 4);

        const clickRate: number = 1;

        return {
            second,
            minute,
            hour,
            day,
            week,
            month,
            clickRate,
        };
    });

    const increment = () => {
        setGame((prevGame) => {
            const newClickRate: number = 1;

            const newSecond: number = prevGame.second + newClickRate;
            const newMinute: number = Math.floor(newSecond / 60);
            const newHour: number = Math.floor(newMinute / 60);
            const newDay: number = Math.floor(newHour / 24);
            const newWeek: number = Math.floor(newDay / 7);
            const newMonth: number = Math.floor(newWeek / 4);

            const updatedGame = {
                second: newSecond,
                minute: newMinute,
                hour: newHour,
                day: newDay,
                week: newWeek,
                month: newMonth,
                clickRate: newClickRate,
            };

            save(updatedGame);
            return updatedGame;
        });
    };

    const save = (updatedGame: { second: number; minute: number; hour: number }) => {
        localStorage.setItem('savedGame', JSON.stringify(updatedGame));
        localStorage.clear()
    };

    interface DisplayTimeProps {
        time: number;
        name: string;
    }
      
    const DisplayTime: React.FC<DisplayTimeProps> = ({ time, name }): JSX.Element => {
        const label = time >= 2 ? `${name}s` : name;
      
        return (
            <div className='displayTime'>
                {time} {label}
            </div>
        );
    };

    const renderTime = () => {
        switch (true) {
            case game.second <= 60: // Seconds
                return (
                    <DisplayTime time={game.second} name="Second" />
                );
            case game.second <= 60 * 60: // Minutes
                return (
                    <DisplayTime time={game.minute} name="Minute" />
                );
            case game.second <= (60 * 60) * 24: // Hours
                return (
                    <DisplayTime time={game.hour} name="Hour" />
                );
            case game.second <= ((60 * 60) * 24) * 7: // Days
                return (
                    <DisplayTime time={game.day} name="Day" />
                )
            case game.second <= (((60 * 60) * 24) * 7) * 4: // Weeks
                return (
                    <DisplayTime time={game.week} name="Week" />
                )
            case game.second <= ((((60 * 60) * 24) * 7) * 4) * 12: // Months
                return (
                    <DisplayTime time={game.month} name="Month" />
                )
        }
    }

    useEffect(() => {
        document.title = `${game.second} - Idle time`;
    }, [game.second])

    return (
        <>
            {renderTime()}
            <Clock second={game.second} minute={game.minute} hour={game.hour} onClick={increment} />
        </>
    );
}

export default Game;