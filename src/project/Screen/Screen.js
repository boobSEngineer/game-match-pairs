import React, {useEffect, useRef, useState} from "react";
import s from "./Screen.module.css";

const Screen = (props) => {
    let [squarePosition, setSquarePosition] = useState({x: -1, y: -1});
    let [square, setSquare] = useState([]);
    let [openSquare, setOpenSquare] = useState([]);
    let [message, setMessage] = useState(false);

    let array_number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ''];

    const canvasRef = useRef(null);

    const addSquare = (position) => {
        square = [...square, {
            square: {
                x: position.x,
                y: position.y,
                status_color: true,
                number: array_number[(position.x * 3) + position.y],
            }
        }];
    }

    let drawSquare = (ctx, x, y) => {
        ctx.beginPath();
        ctx.rect(x * 100, y * 100, 100, 100);
        ctx.fill();
    }

    let drawNumber = (ctx, array) => {
        ctx.font = "22px Arial";
        let counter = 0;
        for (let i = 0; i < 7; i++) {
            for (let j = 1; j < 4; j++) {
                if (i === squarePosition.x && j - 1 === squarePosition.y) {
                    ctx.fillStyle = "gray";
                } else {
                    ctx.fillStyle = "blue";
                }
                ctx.fillText(array[counter], i * 100 + 40, j * 100 - 40);
                counter = 1 + counter;
            }
        }
    }
    let drawOpenSquare = (ctx) => {
        if (square[0] && square[0].square.status_color === true) {
            ctx.fillStyle = 'white';
            drawSquare(ctx, square[0].square.x, square[0].square.y);
        }
        if (square[1] && square[1].square.status_color === true) {
            ctx.fillStyle = 'white';
            drawSquare(ctx, square[1].square.x, square[1].square.y);
        }
        if (openSquare) {
            openSquare.forEach(
                s => {
                    ctx.fillStyle = 'white';
                    drawSquare(ctx, s.square.x0, s.square.y0);
                    drawSquare(ctx, s.square.x1, s.square.y1);
                }
            )
        }
    }

    let drawLine = (ctx) => {
        for (let k = 0; k < 7; k++) { //k = x, g = y
            for (let g = 0; g < 3; g++) {
                if (k === squarePosition.x && g === squarePosition.y) {
                    ctx.fillStyle = 'gray';
                    drawSquare(ctx, k, g);
                } else {
                    ctx.fillStyle = 'blue';
                    drawSquare(ctx, k, g);
                }
            }
        }

        drawOpenSquare(ctx);

        drawNumber(ctx, array_number);



        ctx.strokeStyle = "darkblue";
        ctx.lineWidth = 4
        let line_x = 0;
        let line_y = 0;
        let to_x = 0;
        let to_y = 300;

        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(line_x, line_y);
            ctx.lineTo(to_x, to_y);
            ctx.stroke();
            line_x = line_x + 100;
            to_x = to_x + 100;
        }
        line_x = 0;
        line_y = 0;
        to_x = 700;
        to_y = 0;
        for (let j = 0; j < 4; j++) {
            ctx.beginPath()
            ctx.moveTo(line_x, line_y);
            ctx.lineTo(to_x, to_y);
            ctx.stroke();
            line_y = line_y + 100;
            to_y = to_y + 100;
        }


    }

    function getCursorPosition(canvas, e) {
        const rect = canvas.getBoundingClientRect()
        const x = Math.floor((e.clientX - rect.left) / 100)
        const y = Math.floor((e.clientY - rect.top) / 100);
        return {x: x, y: y};
    }

    useEffect(
        () => {
            let canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            drawLine(ctx);
        }, [drawLine]
    );

    return (
        <>
            <div className={s.wrapper}>
                <div className={s.box}>
                    <div>
                        {message ? <h1>Game over pls press f5</h1> : ''}
                    </div>
                    <canvas height={300} width={700} ref={canvasRef} {...props} onMouseMove={(e) => {
                        let position = getCursorPosition(e.target, e);
                        setSquarePosition({
                            x: position.x,
                            y: position.y
                        });
                    }} onClick={e => {
                        let position = getCursorPosition(e.target, e);
                        let flag = false;
                        openSquare.forEach(s => {
                            if (array_number[(position.x * 3) + position.y] === s.square.number) {
                                flag = true;
                            }
                        })
                        if (flag === true) { return; }
                        if (square.length === 0) {
                            addSquare(position);
                            setSquare(square);
                        } else if (square.length === 1) {
                            addSquare(position);
                            setSquare(square);
                            if (square[0].square.number === square[1].square.number &&
                                (!(square[0].square.x === square[1].square.x && square[0].square.y === square[1].square.y))) {
                                openSquare = [...openSquare, {
                                    square: {
                                        x0: square[0].square.x,
                                        y0: square[0].square.y,
                                        x1: square[1].square.x,
                                        y1: square[1].square.y,
                                        status_color: true,
                                        number: array_number[(position.x * 3) + position.y],
                                    }
                                }];
                                setOpenSquare(openSquare);
                                square = [];
                                setSquare(square);
                            }
                        } else if (square.length === 2) {
                            square = [];
                            addSquare(position);
                            setSquare(square);
                        }
                        if (openSquare.length === 10) {
                            setMessage(true);
                            return;
                        }
                    }}>
                    </canvas>
                </div>
            </div>
        </>

    )
}
export default Screen;
