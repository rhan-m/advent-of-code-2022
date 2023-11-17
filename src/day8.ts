import fs from "fs";

const FILE_PATH = "/home/erhan/learn/ts/advent-of-code-2022/inputs/input_day8";

type StartPoint = {
    i: number,
    j: number
};

function createTreeMatrix(input: string[]): number[][] {
    return input.map(row => row.split("").map(Number));
}

function initializeVisibleMatrix(row: number, column: number): boolean[][] {
    let visible: boolean[][] = []

    for (let i = 0; i < row; i++) {
        visible.push([])
        for (let j = 0; j < column; j++) {
            visible[i][j] = false;
        }
    }
    return visible;
}

function getVisibleFromLeft(matrix: number[][]): boolean[][] {
    let visible: boolean[][] = initializeVisibleMatrix(matrix.length, matrix[0].length);
    for (let i = 0; i < matrix.length; i++) {
        let max = -1;
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > max) {
                visible[i][j] = true;
                max = matrix[i][j];
            }
        }
    }
    return visible;
}

function getVisibleFromRight(matrix: number[][]): boolean[][] {
    let visible: boolean[][] = initializeVisibleMatrix(matrix.length, matrix[0].length);
    for (let i = 0; i < matrix.length; i++) {
        let max = -1;
        for (let j = matrix.length - 1; j >= 0; j--) {
            if (matrix[i][j] > max) {
                visible[i][j] = true;
                max = matrix[i][j];
            }
        }
    }
    return visible;
}

function getVisibleFromTop(matrix: number[][]): boolean[][] {
    let visible: boolean[][] = initializeVisibleMatrix(matrix.length, matrix[0].length);
    for (let j = 0; j < matrix[0].length; j++) {
        let max = -1;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i][j] > max) {
                visible[i][j] = true;
                max = matrix[i][j];
            }
        }    
    }
    return visible;
}

function getVisibleFromBottom(matrix: number[][]): boolean[][] {
    let visible: boolean[][] = initializeVisibleMatrix(matrix.length, matrix[0].length);
    for (let j = matrix[0].length - 1; j >= 0 ; j--) {
        let max = -1;
        for (let i = matrix.length - 1; i >= 0 ; i--) {
            if (matrix[i][j] > max) {
                visible[i][j] = true;
                max = matrix[i][j];
            }
        }    
    }
    return visible;
}

function scenicScoreRight(matrix: number[][], startPoint: StartPoint): number {
    let count = 0;
    let max = matrix[startPoint.i][startPoint.j];
    for (let j = startPoint.j + 1; j < matrix[startPoint.i].length; j++) {
        count++;
        if (matrix[startPoint.i][j] >= max) {
            break;
        }
    }
    return count;
}

function scenicScoreLeft(matrix: number[][], startPoint: StartPoint): number {
    let count = 0;
    let max = matrix[startPoint.i][startPoint.j];
    for (let j = startPoint.j - 1; j >= 0; j--) {
        count++;
        if (matrix[startPoint.i][j] >= max) {
            break;
        }
    }
    return count;
}

function scenicScoreBottom(matrix: number[][], startPoint: StartPoint): number {
    let count = 0;
    let max = matrix[startPoint.i][startPoint.j];
    for (let i = startPoint.i + 1; i < matrix.length; i++) {
        count++;
        if (matrix[i][startPoint.j] >= max) {
            break;
        }
    }
    return count;
}

function scenicScoreTop(matrix: number[][], startPoint: StartPoint): number {
    let count = 0;
    let max = matrix[startPoint.i][startPoint.j];
    for (let i = startPoint.i - 1; i >= 0; i--) {
        count++;
        if (matrix[i][startPoint.j] >= max) {
            break;
        }
    }
    return count;
}

export function solve() {
    const trees = createTreeMatrix(readFile());
    let count = 0;
    let visibleOverall: boolean[][] = initializeVisibleMatrix(trees.length, trees[0].length);
    const visibleFromLeft: boolean[][] =  getVisibleFromLeft(trees);
    const visibleFromRight: boolean[][] = getVisibleFromRight(trees);
    const visibleFromTop: boolean[][] = getVisibleFromTop(trees);
    const visibleFromBottom: boolean[][] =  getVisibleFromBottom(trees);

    for (let i = 0; i < trees.length; i++) {
        for (let j = 0; j < trees[0].length; j++) {
            visibleOverall[i][j] = visibleFromRight[i][j] || visibleFromLeft[i][j] || visibleFromTop[i][j] || visibleFromBottom[i][j]; 
            if (visibleOverall[i][j]) {
                count++;
            }
        }
    }

    console.log(count);

    let max = 0

    for (let i = 0; i < trees.length; i++) {
        for (let j = 0; j < trees[0].length; j++) {
            let start: StartPoint = {i, j};
            let current = scenicScoreTop(trees, start) * scenicScoreBottom(trees, start) * scenicScoreLeft(trees, start) * scenicScoreRight(trees, start);
            if (current > max) {
                max = current;
            }
        }
    }
    console.log(max);
}

function readFile(): string[] {
    return fs.readFileSync(FILE_PATH, 'utf-8').split("\n");
}

function printMatrix<T>(matrix: T[][]) {
    for (let i = 0; i < matrix.length; i++) {
        console.log(...matrix[i]);
    }
    console.log("\n");
}
