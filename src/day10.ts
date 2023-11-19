import fs from "fs";
import path from "path";

const FILE_NAME: string = "../inputs/input_day10";
const FILE_PATH: string = path.join(__dirname, FILE_NAME);

const CYCLE_20: number = 20;
const CYCLE_60: number = 60;
const CYCLE_100: number = 100;
const CYCLE_140: number = 140;
const CYCLE_180: number = 180;
const CYCLE_220: number = 220;

const DISPLAY_WIDTH: number = 40;
const interestCycles: number[] = [CYCLE_20, CYCLE_60, CYCLE_100, CYCLE_140, CYCLE_180, CYCLE_220];

const NOOP_OPERATION: string = "noop";
const NOOP_CYCLES: number = 1;
const ADDX_OPERATION: string = "addx";
const ADDX_CYCLES: number = 2;
const display: string[] = [];

type Operation = {
    name: string,
    cycles: number
}

const AddxOperation: Operation = { name: ADDX_OPERATION, cycles: ADDX_CYCLES };
const NoopOperation: Operation = { name: NOOP_OPERATION, cycles: NOOP_CYCLES };


export function solve() {
    const operations: string[] = readInput(FILE_PATH);

    let currentLine: string = "";
    let cycle = 0;
    let register = 1;
    let signalSum = 0;
    for (let index = 0; index < operations.length; index++) {
        let cycleResult;
        if (operations[index].startsWith(NOOP_OPERATION)) {
            [cycleResult, cycle, currentLine] = executeCycles(cycle, register, NoopOperation, currentLine);
            signalSum += cycleResult;            
        } else {
            [cycleResult, cycle, currentLine] = executeCycles(cycle, register, AddxOperation, currentLine);
            signalSum += cycleResult;
            register += Number(operations[index].replace(ADDX_OPERATION, '').trim());
        }
    }
    console.log(signalSum);
    console.log(display);
}

function drawLine(register: number, currentLine: string) {
    if (currentLine.length >= register - 1 && currentLine.length < register + 2) {
        currentLine += '#';
    } else {
        currentLine += '.';
    }
    if (currentLine.length === DISPLAY_WIDTH) {
        display.push(currentLine + "\n");
        currentLine = "";
    }
    return currentLine;
}

function executeCycles(cycle: number, register: number, operation: Operation, currentLine: string): [number, number, string] {
    let cycleResult = 0;
    for (let i = 0; i < operation.cycles; i++) {
        currentLine = drawLine(register, currentLine);
        cycle++;
        if (interestCycles.includes(cycle)) {
            cycleResult = register * cycle;
        }
    }
    return [cycleResult, cycle, currentLine];
}

function readInput(filePath: string): string[] {
    return fs.readFileSync(filePath, 'utf-8').split("\n");
}