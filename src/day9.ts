import fs from "fs";
import path from "path";

const FILE_NAME: string = "../inputs/input_day9";
const FILE_PATH: string = path.join(__dirname, FILE_NAME);

const UP: string = "U";
const DOWN: string = "D";
const LEFT: string = "L";
const RIGHT: string = "R";

enum Action {
    UP = 'UP',
    DOWN = 'DOWN',
    RIGHT = 'RIGHT',
    LEFT = 'LEFT'
}

type Node = {
    next: Node | undefined,
    position: Position
};

type Position = {
    x: number,
    y: number
};

type Move = {
    action: Action,
    squares: number
}

export function solve() {
    computeMoves();
}

function parseInput(input: string[]): Move[] {
    let moves: Move[] = [];

    input.forEach(line => {
        if (line.startsWith(UP)) {
            moves.push({ action: Action.UP, squares: Number(line.replace(UP, "").trim()) });
        } else if (line.startsWith(DOWN)) {
            moves.push({ action: Action.DOWN, squares: Number(line.replace(DOWN, "").trim()) });
        } else if (line.startsWith(LEFT)) {
            moves.push({ action: Action.LEFT, squares: Number(line.replace(LEFT, "").trim()) });
        } else {
            moves.push({ action: Action.RIGHT, squares: Number(line.replace(RIGHT, "").trim()) });
        }
    });

    return moves;
}

function readInput(filePath: string): string[] {
    return fs.readFileSync(filePath, "utf-8").split("\n");
}

function moveHead(head: Node, move: Move): Node {
    let nextHead: Node | undefined;
    switch (move.action) {
        case Action.UP:
            nextHead = { position: { x: head.position.x, y: head.position.y + 1 }, next: undefined };
            break;
        case Action.DOWN:
            nextHead = { position: { x: head.position.x, y: head.position.y - 1 }, next: undefined };
            break;
        case Action.LEFT:
            nextHead = { position: { x: head.position.x - 1, y: head.position.y }, next: undefined };
            break;
        case Action.RIGHT:
            nextHead = { position: { x: head.position.x + 1, y: head.position.y }, next: undefined };
            break;
    }
    return nextHead;
}

function computeMoves() {
    let startPosition: Position = { x: 0, y: 0 };
    let dummyHead: Node = { next: undefined, position: startPosition };
    let dummyTail: Node = { next: undefined, position: startPosition };
    let head: Node = dummyHead;
    let tail: Node = dummyTail;

    parseInput(readInput(FILE_PATH)).forEach(move => {
        for (let i = 0; i < move.squares; i++) {
            let nextHead: Node | undefined = moveHead(head, move);
    
            const dx = nextHead.position.x - tail.position.x;
            const dy = nextHead.position.y - tail.position.y;

            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                tail.next = { position: { x: tail.position.x + Math.sign(dx), y: tail.position.y + Math.sign(dy) }, next: undefined };
                tail = tail.next;
            }

            head.next = nextHead;
            head = head.next;
        }
    });

    countPositions(dummyTail);
}

function countPositions(head: Node) {
    const positions = new Set<string>();
    let dummy: Node | undefined = head;
    while (dummy) {
        let position = String(JSON.stringify(dummy.position));
        if (!positions.has(position)) {
            positions.add(position);
        }
        dummy = dummy.next;
    }
    console.log(positions.size);
}
