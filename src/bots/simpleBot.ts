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

        if(noOfRounds < this.window) {
            return this.randomShoot(this.randomiser);
        }

        let slicingPoint = Math.max(noOfRounds-this.window, 0);
        let previousRes = this.resultRecord.slice(slicingPoint);
        let prevWins = previousRes.reduce((acc, curr) => { return acc + curr; }, 0);
        if(prevWins == 0) {
            return this.randomShoot(this.randomiser);
        }

        let previousPlays = gamestate.rounds.slice(slicingPoint);
        if(prevWins < this.window/2 * -1){
            this.window++;
            return this.randomShoot(this.randomiser);
            // return this.toWin[previousPlays[0].p2][0] as BotSelection;
        } 
        
        return this.toWin[previousPlays[0].p2][0] as BotSelection;
        // let move = 'D' as BotSelection;
        // if(this.myDCount > 0) {
        //     this.myDCount--;
        // } else {
        //     move = this.randomiser[Math.floor(Math.random()*3)];
        // }
        // return move;
    }
    
    private randomShoot(choices: Array<BotSelection>){
        console.log(Math.floor(Math.random()*choices.length))
        let choice = choices[Math.floor(Math.random()*choices.length)];
        if(choice == 'D' && this.myDCount > 0){
            this.myDCount--;
            return 'D'
        }
        return choices.length == 2 ? choices[0] : choice;
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
