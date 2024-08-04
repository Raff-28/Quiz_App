import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

type Props = {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const HomePage = (props: Props) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [highScore, setHighScore] = useState<string>("");
    const [previousAttemptScore, setPreviousAttemptScore] = useState<string>("");

    useEffect(() => {
        if (!props.isLoggedIn) {
            navigate('/login');
        };
        
        const storedUsername = localStorage.getItem("username") || "";
        const storedHighScore = localStorage.getItem("highScore") || "";
        const storedPreviousAttemptScore = localStorage.getItem("score") || "";

        setUsername(storedUsername);
        setHighScore(storedHighScore);
        setPreviousAttemptScore(storedPreviousAttemptScore);
    }, []);

    return (
        <>
            <div className="container p-5 100vh w-75">
                <Card>
                    <Card.Header className="bg-info">
                        <div className="h2 text-center text-light"><strong>Computer Quiz</strong></div>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex flex-column align-items-center">
                            <div className="h5">Username: {username}</div>
                            <div className="h5">Highest Score: {highScore}/10</div>
                        </div>
                    </Card.Body>
                    <Card.Footer className="bg-info">
                        <div className="d-flex justify-content-between">
                            <Button variant="danger" onClick={() => {
                                props.setIsLoggedIn(false);
                                navigate('/login');
                            }}>
                                <strong>Log Out</strong>
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/quiz')}>
                                {previousAttemptScore ? (
                                    <strong>Resume previous Quiz</strong>
                                ) : (
                                    <strong>Start a new quiz</strong>
                                )}
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        </>
    )
}