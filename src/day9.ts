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
    computeMoves(2);
    computeMoves(10);
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

function computeMoves(nodesNumber: number) {
    const startPosition: Position = { x: 0, y: 0 };
    const nodes: Node[] = []; 

    for (let i = 0; i < nodesNumber; i++) {
        nodes.push({ next: undefined, position: startPosition });
    }

    let dummyHead: Node = nodes[0];
    let dummyTail: Node = nodes[nodes.length - 1];
    let head: Node = dummyHead;

    parseInput(readInput(FILE_PATH)).forEach(move => {
        for (let i = 0; i < move.squares; i++) {
            let nextHead: Node | undefined = moveHead(head, move);
            let auxHead = nextHead;
            for (let j = 1; j < nodes.length; j++) {
                const dx = auxHead.position.x - nodes[j].position.x;
                const dy = auxHead.position.y - nodes[j].position.y;

                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    nodes[j].next = { position: { x: nodes[j].position.x + Math.sign(dx), y: nodes[j].position.y + Math.sign(dy) }, next: undefined };
                    nodes[j] = nodes[j].next!;
                }
                auxHead = nodes[j];
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
