import axios from "axios";
import { useEffect, useState } from "react";
import { QuestionComponent } from "../components/QuestionComponent";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

export type QuizData = {
    question: string;
    allAnswers: string[];
    correctAnswer: string;
}

export const QuizPage = () => {
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState<QuizData[]>([{ question: "", allAnswers: [""], correctAnswer: "" }]);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [scoreModalShow, setScoreModalShow] = useState<boolean>(false);
    const [totalAnswerCount, setTotalAnswerCount] = useState<number>(0);
    const [incorrectAnswerCount, setIncorrectAnswerCount] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(300);

    const handleMoveToNextQuestion = () => {
        if (questionIndex < quizData.length - 1) {
            setQuestionIndex(prev => prev + 1);
        } else {
            handleFinishQuiz();
        };
    };

    const handleFinishQuiz = () => {
        setScoreModalShow(true);
    };

    useEffect(() => {

        const fetchQuizData = async () => {
            try {
                const response = await axios.get('https://opentdb.com/api.php?amount=10&category=18&type=multiple');
                const formattedData = response.data.results.map((item: any) => ({
                    question: item.question,
                    allAnswers: [...item.incorrect_answers, item.correct_answer].sort(),
                    correctAnswer: item.correct_answer,
                }));
                setQuizData(formattedData);
                localStorage.setItem('quizData', JSON.stringify(formattedData));
            } catch (e) {
                console.error(e);
            };
        };

        const loadSavedState = () => {
            const savedQuizData = localStorage.getItem('quizData');
            const savedQuestionIndex = localStorage.getItem('questionIndex');
            const savedScore = localStorage.getItem('score');
            const savedTotalAnswerCount = localStorage.getItem('totalAnswerCount');
            const savedIncorrectAnswerCount = localStorage.getItem('incorrectAnswerCount');
            const savedTimeLeft = localStorage.getItem('timeLeft');

            if (savedQuizData) {
                setQuizData(JSON.parse(savedQuizData));
            } else {
                fetchQuizData();
            }
            if (savedQuestionIndex) setQuestionIndex(Number(savedQuestionIndex));
            if (savedScore) setScore(Number(savedScore));
            if (savedTotalAnswerCount) setTotalAnswerCount(Number(savedTotalAnswerCount));
            if (savedIncorrectAnswerCount) setIncorrectAnswerCount(Number(savedIncorrectAnswerCount));
            if (savedTimeLeft) setTimeLeft(Number(savedTimeLeft));
        };

        loadSavedState();

    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                const newTime = prevTime - 1;
                localStorage.setItem('timeLeft', newTime.toString());
                if (newTime <= 0) {
                    clearInterval(timer);
                    handleFinishQuiz();
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('questionIndex', questionIndex.toString());
        localStorage.setItem('score', score.toString());
        localStorage.setItem('totalAnswerCount', totalAnswerCount.toString());
        localStorage.setItem('incorrectAnswerCount', incorrectAnswerCount.toString());
    }, [questionIndex, score, totalAnswerCount, incorrectAnswerCount]);

    return (
        <>
            <Modal
                show={scoreModalShow}
                onHide={() => {
                    setScoreModalShow(false);
                    localStorage.setItem('questionIndex', "");
                    localStorage.setItem('score', "");
                    localStorage.setItem('totalAnswerCount', "");
                    localStorage.setItem('incorrectAnswerCount', "");
                    localStorage.setItem('quizData', "");
                    localStorage.setItem('timeLeft', "");
                    navigate('/');
                }}
                centered
                size="sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Quiz Result
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center">
                        <div className="h5 mb-3 text-dark">Total Questions Answered: {totalAnswerCount}</div>
                        <div className="h5 mb-3 text-success">Correct Answer: {score}</div>
                        <div className="h5 text-danger">Incorrect Answers: {incorrectAnswerCount}</div>
                    </div>
                </Modal.Body>
            </Modal>
            <QuestionComponent
                quizData={quizData[questionIndex]}
                questionIndex={questionIndex}
                setScore={setScore}
                timeLeft={timeLeft}
                totalAnswerCount={totalAnswerCount}
                setTotalAnswerCount={setTotalAnswerCount}
                setIncorrectAnswerCount={setIncorrectAnswerCount}
                handleMoveToNextQuestion={handleMoveToNextQuestion}
                onTimeUp={handleFinishQuiz}
            />
        </>
    )
}