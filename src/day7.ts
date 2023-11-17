import fs from "fs";

const CD_COMMAND = "$ cd ";
const GO_BACK_COMMAND = "$ cd ..";
const LS_COMMAND = "$ ls";
const DIR_ENTRY = "dir";
const FILE_PATH = "/home/erhan/learn/ts/advent-of-code-2022/inputs/input_day7";
const MAX_VALUE_PART1 = 100000;
const SPACE_NEEDED = 30000000;
const TOTAL_DISK_SPACE = 70000000;

interface FileSystemEntry {
    name: String,
    size: number,
    parent: FileSystemEntry | undefined,
    print(padding: String): void;
};


class Directory implements FileSystemEntry {
    name: String;
    size: number;
    parent: FileSystemEntry | undefined;
    entries: Map<String, FileSystemEntry>;

    constructor(name: String, parent: FileSystemEntry | undefined) {
        this.name = name;
        this.size = 0;
        this.parent = parent;
        this.entries = new Map();
    }

    print(padding: String) {
        console.log(`${padding}${this.name}: ${this.size}`);
        padding += "\t";
        this.entries.forEach((k, v) => {
            k.print(padding);
        });
    }
};

class File implements FileSystemEntry {
    name: String;
    size: number;
    parent: FileSystemEntry | undefined;

    constructor(name: String, size: number, parent: FileSystemEntry | undefined) {
        this.name = name;
        this.size = size;
        this.parent = parent;
    }

    print(padding: String) {
        console.log(`${padding}${this.name}: ${this.size}`);
    }
};

function solvePart1(root: Directory) {
    let sum = 0;
    let stack: FileSystemEntry[] = [];
    stack.push(root);

    while (stack.length !== 0) {
        let currNode = stack.pop();
        if (currNode instanceof Directory) {
            if (currNode.size <= MAX_VALUE_PART1) {
                sum += currNode.size;
            }
            currNode.entries.forEach((k, v) => {
                if (k instanceof Directory) {
                    stack.push(k);
                }
            });   
        }
    }
    console.log(sum);
}

function solvePart2(root: Directory) {
    let stack: FileSystemEntry[] = [];
    let currentSpace: number = root.size;
    let freeSpace: number = TOTAL_DISK_SPACE - currentSpace;

    let minSpace = Number.MAX_VALUE;
    stack = [];
    stack.push(root);
    while (stack.length !== 0) {
        let currNode = stack.pop();
        if (currNode instanceof Directory) {
            if (currNode.size >= (SPACE_NEEDED - freeSpace) && currNode.size < minSpace) {
                minSpace = currNode.size;
            }
            currNode.entries.forEach((k, v) => {
                if (k instanceof Directory) {
                    stack.push(k);
                }
            });   
        }
    }
    console.log(minSpace);
}

export function solve() {
    let root: Directory = parseInput(readFile());
    
    solvePart1(root);
    solvePart2(root);
    
    printSubsystem(root);
}

function readFile(): String[] {
    return fs.readFileSync(FILE_PATH, 'utf-8').split("\n");
};

function parseInput(input: String[]): Directory {
    const root = new Directory("/", undefined);
    let currentDir = root;
    for (let i in input) {
        let line = input[i];
        if (line.startsWith(GO_BACK_COMMAND)) {
            if (currentDir.parent !== undefined && currentDir.parent instanceof Directory) {
                currentDir = currentDir.parent;
            }
        } else if (line.startsWith(CD_COMMAND)) {
            let subDir = currentDir.entries.get(line.replace(CD_COMMAND, '').trim());
            if (subDir !== undefined && subDir instanceof Directory) {
                currentDir = subDir;
            }
        } else if (line.startsWith(LS_COMMAND)) {
            continue;
        } else {
            if (line.startsWith(DIR_ENTRY)) {
                createNewDirectory(currentDir, line);
            } else {
                createNewFileUpdateParents(currentDir, line);
            }
        }
    }

    return root;
};

function createNewDirectory(currentDir: Directory, line: String) {
    let dirName = line.replace(DIR_ENTRY, "").trim();
    let subDir = new Directory(dirName, currentDir);
    currentDir.entries.set(dirName, subDir);
}

function createNewFileUpdateParents(currentDir: Directory, line: String) {
    let fileProps = line.split(" ");
    let fileSize: number = Number(fileProps[0]);
    let fileName: String = fileProps[1] ?? "";

    let file = new File(fileName, fileSize, currentDir);
    currentDir.entries.set(fileName, file);
    currentDir.size += file.size;
    updateParentDirectorySize(currentDir, fileSize);
}

function updateParentDirectorySize(currentDir: Directory, fileSize: number) {
    let parent = currentDir.parent;
    while (parent !== undefined) {
        parent.size += fileSize;
        parent = parent.parent;
    }
}

function printSubsystem (root: Directory) {
    root.print("");
}