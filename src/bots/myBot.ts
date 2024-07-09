import { Gamestate, BotSelection } from '../models/gamestate';

type Result = 1 | 0 | -1;

class Bot {
    myDCount: number = 100;
    opDCount: number = 100;
    randomiser: Array<BotSelection> = ['R', 'P', 'S'];
    toWin= {R:['P','D'],
            P:['S','D'],
            S:['R','D'],
            D:['W'],
            W:['R','P','S']
    }
    resultRecord: Array<Result> = new Array();
    window: number = 1;
    makeMove(gamestate: Gamestate): BotSelection {
        this.registerLastResult(gamestate);
        let noOfRounds = gamestate.rounds.length;
        
        // const lastOpponentMove = gamestate.rounds[noOfRounds-1].p2;
        // const myLastMove = gamestate.rounds[noOfRounds-1].p1;
        // 5 rounds of buffering
        if(noOfRounds < this.window) {
            return this.randomiser[Math.floor(Math.random()*3)];
        }
        let slicingPoint = Math.max(noOfRounds-this.window, 0);
        let previousRes = this.resultRecord.slice(slicingPoint);
        if(previousRes[this.window-1] == -1){//previousRes.reduce((acc, curr) => { return acc + curr; }, 0) <= -1*this.window
            this.window++;
            if(this.window >= 101 && this.myDCount > 0){
                this.myDCount--;
                this.window = 1;
                return 'D';
            }
        }
        let previousPlays = gamestate.rounds.slice(slicingPoint);
        
        return this.toWin[previousPlays[0].p2][0] as BotSelection;
        // let move = 'D' as BotSelection;
        // if(this.myDCount > 0) {
        //     this.myDCount--;
        // } else {
        //     move = this.randomiser[Math.floor(Math.random()*3)];
        // }
        // return move;
    }

    private registerLastResult(gamestate: Gamestate){
        let noOfRounds = gamestate.rounds.length;
        if(noOfRounds == 0){
            return;
        }
        const lastOpponentMove = gamestate.rounds[noOfRounds-1].p2;
        const myLastMove = gamestate.rounds[noOfRounds-1].p1;
        if(lastOpponentMove == myLastMove){
            this.resultRecord.push(0);
            return;
        }
        let toWinOp = this.toWin[lastOpponentMove] as Array<String>;
        if(toWinOp.includes(myLastMove)){
            this.resultRecord.push(1);
        } else {
            this.resultRecord.push(-1);
        }
    }
}

export = new Bot();
