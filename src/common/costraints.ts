import { RankData } from "src/interfaces";

export const levelIncomeAmount = {
    1: 200,
    2: 30,
    3: 20,
    4: 10,
    5: 5,
    6: 5,
    7: 5,
    8: 5,
    9: 5,
    10: 5
};

export const Ranks: RankData[] = [
    {
        type: 'RANK1',
        autopool: 3,
        income: 100,
    },
    {
        type: 'RANK2',
        autopool: 9,
        income: 180,
    },
    {
        type: 'RANK3',
        autopool: 27,
        income: 400,
    },
    {
        type: 'RANK4',
        autopool: 81,
        income: 720,
    },
    {
        type: 'RANK5',
        autopool: 243,
        income: 1600,
    },
    {
        type: 'RANK6',
        autopool: 729,
        income: 3200,
    },
    {
        type: 'RANK7',
        autopool: 2187,
        income: 6400,
    },
    {
        type: 'RANK8',
        autopool: 6561,
        income: 15000,
    },
    {
        type: 'RANK9',
        autopool: 19683,
        income: 100000,
    },
    {
        type: 'RANK10',
        autopool: 59049,
        income: 250000,
    },
];