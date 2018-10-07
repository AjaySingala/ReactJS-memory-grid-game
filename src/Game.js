import React from 'react';
import Row from './Row';
import Cell from './Cell';
import Footer from './Footer';
import _ from "lodash";

class Game extends React.Component {
    constructor(props) {
        super(props);
        //this.state = { gameState: 'ready' };
        this.matrix = [];
        for (let r = 0; r < this.props.rows; r++) {
            let row = [];
            for (let c = 0; c < this.props.columns; c++) {
                row.push(`${r}${c}`);
            }
            this.matrix.push(row);
        }

        let flatMatrix = _.flatten(this.matrix);
        this.activeCells = _.sampleSize(flatMatrix,
            this.props.activeCellsCount);

        this.state = {
            gameState: "ready",
            wrongGuesses: [],
            correctGuesses: []
        };
    }

    // componentDidMount() {
    //     // Set to "memorize" after 2 seconds.
    //     // If succeeds, set to "recall" after 2 more seconds, i.e.; 4 seconds.
    //     setTimeout(() => {
    //         this.setState({ gameState: 'memorize' }, () => {
    //             setTimeout(() => this.setState({ gameState: 'recall' }), 2000);
    //         });
    //     }, 2000);
    // }

    componentDidMount() {
        // Set to "memorize" after 2 seconds.
        // If succeeds, set to "recall" after 2 more seconds, i.e.; 4 seconds.
        this.memorizeTimerId = setTimeout(() => {
            this.setState({ gameState: 'memorize' }, () => {
                this.recallTimerId = setTimeout(
                    this.startRecallMode.bind(this), 2000);
            });
        }, 2000);
    }

    componentWillUnmount() {
        clearTimeout(this.memorizeTimerId);
        clearTimeout(this.recallTimerId);
        this.finishGame();
    }

    startRecallMode() {
        this.setState({ gameState: 'recall'}, () => {
            this.secondsRemaining = this.props.timeoutSeconds;
            this.playTimerId = setInterval(() => {
                if(--this.secondsRemaining === 0) {
                    this.setState({gameState: this.finishGame("lost")});
                }
            }, 1000);
        });
    }

    finishGame(gameState) {
        clearInterval(this.playTimerId);
        return gameState;
    }

    recordGuess({ cellId, userGuessIsCorrect }) {
        let { wrongGuesses, correctGuesses, gameState } = this.state;
        if (userGuessIsCorrect) {
            correctGuesses.push(cellId);
            if (correctGuesses.length === this.props.activeCellsCount) {
                gameState = this.finishGame("won");
            }
        } else {
            wrongGuesses.push(cellId);
            if (wrongGuesses.length > this.props.allowedWrongAttempts) {
                gameState = this.finishGame("lost");
            }
        }
        this.setState({ correctGuesses, wrongGuesses, gameState });
    }

    render() {
        // let matrix = [], row;
        // for (let r = 0; r < this.props.rows; r++) {
        //     row = [];
        //     for (let c = 0; c < this.props.columns; c++) {
        //         row.push(`${r}${c}`);
        //     }
        //     matrix.push(row);
        // }

        let showActiveCells = ["memorize", "lost"].indexOf(this.state.gameState) >= 0;
        return (
            <div className="grid">
                {this.matrix.map((row, ri) => (
                    <Row key={ri}>
                        {row.map(cellId => <Cell key={cellId} id={cellId}
                            showActiveCells={showActiveCells}
                            activeCells={this.activeCells}
                            {...this.state}
                            recordGuess={this.recordGuess.bind(this)} />)}
                    </Row>
                ))}

                <Footer {...this.state}
                    playAgain={this.props.createNewGame}
                    activeCellsCount={this.props.activeCellsCount} />
            </div>

        );
    }
}

Game.defaultProps = {
    allowedWrongAttempts: 2,
    timeoutSeconds: 10
};

export default Game;
