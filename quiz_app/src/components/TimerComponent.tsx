import { useEffect } from "react";

type Props = {
    timeLeft: number;
    onTimeUp: () => void;
}

export const TimerComponent = (props: Props) => {
    useEffect(() => {
        const timer = setInterval(() => {
            if (props.timeLeft <= 1) {
                clearInterval(timer);
                props.onTimeUp();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [props.timeLeft, props.onTimeUp]);

    return (
        <div className="h6 text-light">
            <strong>Time Left:
                <span className="text-light"> {props.timeLeft} seconds</span>
            </strong>
        </div>
    );
};