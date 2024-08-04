import { Card } from "react-bootstrap";
import { QuizData } from "../pages/QuizPage";
import { TimerComponent } from "./TimerComponent";

type Props = {
    quizData: QuizData;
    questionIndex: number;
    setScore: (score: (prevScore: number) => number) => void;
    timeLeft: number;
    totalAnswerCount: number;
    setTotalAnswerCount: (count: (prevCount: number) => number) => void;
    setIncorrectAnswerCount: (count: (prevCount: number) => number) => void;
    handleMoveToNextQuestion: () => void;
    onTimeUp: () => void;
}

export const QuestionComponent = (props: Props) => {

    const handleClickAnswer = (answer: string) => {
        if (answer === props.quizData.correctAnswer) {
            props.setScore(prevScore => {
                const newScore = prevScore + 1;
                const highScore = Number(localStorage.getItem('highScore'));
                if (newScore > highScore) {
                    localStorage.setItem('highScore', newScore.toString());
                }
                return newScore;
            });
        } else {
            props.setIncorrectAnswerCount(prevCount => prevCount + 1);
        }
        props.setTotalAnswerCount(prevCount => prevCount + 1);
        props.handleMoveToNextQuestion();
    };

    return (
        <div className="container w-50 vh-100 d-flex flex-column justify-content-center">
            <Card>
                <Card.Header className="bg-info">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="h6 text-light"><strong>Category: Computer</strong></div>
                        <TimerComponent onTimeUp={props.onTimeUp} timeLeft={props.timeLeft} />
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="h5 mb-3"><strong>{props.questionIndex + 1}. {props.quizData.question}</strong></div>
                    {props.quizData.allAnswers.map((answer, index) => (
                        <div className="alert alert-light" key={index} onClick={() => handleClickAnswer(answer)} style={{ cursor: "pointer" }}>
                            {answer}
                        </div>
                    ))}
                </Card.Body>
                <Card.Footer className="bg-info">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="h6 text-light"><strong>Answered {props.totalAnswerCount} of 10 questions</strong></div>
                    </div>
                </Card.Footer>
            </Card>
        </div>
    )
}