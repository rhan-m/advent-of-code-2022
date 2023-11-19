import fs from "fs";
import path from "path";

const FILE_NAME: string = "../inputs/input_day11";
const FILE_PATH: string = path.join(__dirname, FILE_NAME);

const monkeys: Map<number, Monkey> = new Map();
const monkeysInspectedItems: Map<number, number[]> = new Map();

const MONKEY_ENTRY: string = "Monkey";
const MONKEY_ITEMS: string = "Starting items:";
const MONKEY_TEST: string = "Test: divisible by";
const MONKEY_FEAR_INCREASE_RATE: string = "Operation: new = old ";
const TEST_TRUE_ACTION: string = "If true: throw to monkey";
const TEST_FALSE_ACTION: string = "If false: throw to monkey";
const ROUND_NUMBERS: number = 10000;
const FEAR_DECREASE_RATE: number = 3;

type Monkey = {
    id: number,
    items: number[],
    checkFunction(nr: number): boolean,
    fearIncrease(nr: number): number,
    idCheckTrue: number,
    idCheckFalse: number
};

export function solve() {
    parseInput(readInput(FILE_PATH));
    for (let i = 0; i < ROUND_NUMBERS; i++) {
        simulateRound();
    }
    monkeysInspectedItems.forEach((k, v) => {
        console.log(`${v}: ${monkeysInspectedItems.get(v)?.length}`)
    })
}

function simulateRound() {
    monkeys.forEach((k, _) => {
        k.items.forEach(item => {
            monkeysInspectedItems.get(k.id)?.push(item);
            let fearLevel = k.fearIncrease(item);
            // console.log(fearLevel);
            let decreasedFear = Math.floor(fearLevel / FEAR_DECREASE_RATE);
            if (k.checkFunction(decreasedFear)) {
                monkeys.get(k.idCheckTrue)?.items.push(decreasedFear);
            } else {
                monkeys.get(k.idCheckFalse)?.items.push(decreasedFear);
            }
        });
        k.items = [];
    });
}



function parseInput(input: string[]) {
    let i = 0;
    let id: number = -1;
    let items: number[] = [];
    let checkFunction: ((nr: number) => boolean);
    let fearIncrease: ((nr: number) => number);
    let idCheckTrue: number = -1;
    let idCheckFalse: number = -1;

    while (i < input.length) {
        if (input[i].includes(MONKEY_ENTRY)) {
            id = Number(input[i].replace(MONKEY_ENTRY, '').replace(":", '').trim());
        } else if (input[i].includes(MONKEY_ITEMS)) {
            items = input[i].replace(MONKEY_ITEMS, '').trim().split(', ').map(entry => Number(entry));
        } else if (input[i].includes(MONKEY_FEAR_INCREASE_RATE)) {
            let factor: string = input[i].replace(MONKEY_FEAR_INCREASE_RATE, '').trim();
            if (factor.includes("+")) {
                factor = factor.replace("+", "").trim();
                fearIncrease = (nr: number) => {
                    if (Number.isNaN(factor)) {
                        return nr + nr;
                    }
                    return nr + Number(factor);
                }
            } else {
                factor = factor.replace("*", "").trim();
                fearIncrease = (nr: number) => {
                    if (factor === "old") {
                        return nr * nr;
                    }
                    return nr * Number(factor);
                }
            }
            i++;

            let divisible: number = Number(input[i].replace(MONKEY_TEST, ''));
            checkFunction = (nr: number) => {
                return nr % divisible === 0;
            }
            while (input[i] !== '') {
                if (input[i].includes(TEST_TRUE_ACTION)) {
                    idCheckTrue = Number(input[i].replace(TEST_TRUE_ACTION, ""));
                } else {
                    idCheckFalse = Number(input[i].replace(TEST_FALSE_ACTION, ""));
                }
                i++;
            }
            let monkey: Monkey = {id, items, checkFunction, idCheckTrue, idCheckFalse, fearIncrease};
            monkeys.set(monkey.id, monkey);
            monkeysInspectedItems.set(monkey.id, []);
        }
        i++;
    }
}

function readInput(filePath: string): string[] {
    return fs.readFileSync(filePath, 'utf-8').split('\n');
}