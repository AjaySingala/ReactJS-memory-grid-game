import React from 'react';

class Cell extends React.Component {
    active() {
        return this.props.activeCells.indexOf(this.props.id) >= 0;
    }

    handleClick() {
        if (this.guessState() === undefined &&
            this.props.gameState === "recall") {
            this.props.recordGuess({
                cellId: this.props.id,
                userGuessIsCorrect: this.active()
            });
        }
    }

    guessState() {
        if(this.props.correctGuesses.indexOf(this.props.id) >= 0) {
            return true;
        }
        else if(this.props.wrongGuesses.indexOf(this.props.id) >= 0) {
            return false;
        }
    }

    // showActiveCells() {
    //     return ["memorize", "lost"].indexOf(this.props.gameState) >= 0;
    // }

    render() {
        let className = "cell";
        //if (this.props.gameState === "memorize" && this.active()) {
        // if (this.showActiveCells() && this.active()) {
        if (this.props.showActiveCells && this.active()) {    
            className += " active";
        }

        className += " guess-" + this.guessState();

        return (
            <div className={className} onClick={this.handleClick.bind(this)}>
                {/* {this.props.id} */}
            </div>
        );
    }
}

export default Cell;