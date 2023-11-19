import collections

f = open("../inputs/input_day12", "r")
moves = [(0, 1), (0, -1), (1, 0), (-1, 0)]
grid = [list(line) for line in f.read().split("\n")]

start_positions = []
for i in range(len(grid)):
    for j in range(len(grid)):
        if grid[i][j] == "S" or grid[i][j] == 'a':
            grid[i][j] = 'a'
            start_positions.append((i, j))
            break


def solve():
    visited = set()
    q = collections.deque()
    print(start_positions)
    for start in start_positions:
        q.append((start[0], start[1], 0))
    while len(q):
        y, x, steps = q.popleft()
        if grid[y][x] == 'E':
            print(steps)
            break
        if (y, x) not in visited:
            for move in moves:
                nextY = y + move[0]
                nextX = x + move[1]
                currVal = grid[y][x]
                if (0 <= nextY < len(grid)) and (0 <= nextX < len(grid[0])):
                    nextVal = grid[nextY][nextX].replace('E', 'z')
                    print(ord(nextVal) - ord(currVal), currVal, nextVal, (y, x), (nextY, nextX))
                    if ord(nextVal) - 1 <= ord(currVal):
                        q.append((nextY, nextX, steps + 1))
                        visited.add((y, x))


solve()
