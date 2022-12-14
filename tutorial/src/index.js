import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { // fonction composant au lieu de compo (class) car ne contient qu'une méthode render
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let list = [];
        for (let i = 0; i < 9; i+=3) {
            list.push(
                <div className="board-row"  key={i}>
                    {this.renderSquare(i)}
                    {this.renderSquare(i+1)}
                    {this.renderSquare(i+2)}
                </div>
            )
        }
        return (
            <div>
                {list}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            position: [{
                row: null,
                column: null
            }],
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const position = this.state.position.slice(0, this.state.stepNumber + 1);

        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const row = Math.floor(i / 3) + 1;
        const column = i % 3 + 1;

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            position: position.concat([{
                row: row,
                column: column,
            }]),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Revenir au tour no' + move :
                'Revenir au début de la partie';

            const style = move === this.state.stepNumber ? 'bold' : 'normal';

            const row = this.state.position[move].row;
            const column = this.state.position[move].column;

            return (
                <li key={move}>
                    <p>( {row} , {column} )</p>
                    <button style={{ fontWeight: style }} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = winner + ' a gagné';
        } else {
            status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

const found = squares.find(element => element =! "X" );
console.log(found)
if (found) {
    return null;
} else console.log("N"); 

}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
