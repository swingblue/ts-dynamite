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
    // resultRecord: Array<Result> = new Array();
    window: number = 1;
    noOfRounds: number = 0;
    consecutiveLoses: number = 0;
    consecutiveWaterBombs: number = 0;
    makeMove(gamestate: Gamestate): BotSelection {
        this.registerLastResult(gamestate);
        this.noOfRounds = gamestate.rounds.length;
        if(this.noOfRounds < this.window){
            return this.randomShoot(this.randomiser);
        }
        if(this.consecutiveLoses>=this.window){
            this.window++;
            if(this.consecutiveLoses == 10){
                this.window = 1;
            }
        }
        if(this.window > 101){
            this.window=1;
        }
        
        return this.winPrev(gamestate);
    }
    
    private winPrev(gamestate: Gamestate): BotSelection {
        
        let previousRes = gamestate.rounds.slice(Math.max(this.noOfRounds-this.window,0));
        const lastOpponentMove = previousRes[0].p2;
        let choice = this.randomShoot(this.toWin[lastOpponentMove] as Array<BotSelection>);
        if(choice == 'W' && this.consecutiveLoses>this.consecutiveWaterBombs && this.consecutiveWaterBombs > 10){
            return this.randomShoot(this.randomiser);
        }
        return choice;
    }

    private copyOpPrev(gamestate: Gamestate): BotSelection {
        let previousRes = gamestate.rounds.slice(Math.max(this.noOfRounds-this.window,0));
        const lastOpponentMove = previousRes[0].p2;
        if(lastOpponentMove == 'D'){
            if(this.myDCount == 0){
                return 'R';
            } else {
                this.myDCount--;
                return 'D';
            }
        }
        return lastOpponentMove;
    }

    private randomShoot(choices: Array<BotSelection>){
        // console.log(Math.floor(Math.random()*choices.length))
        let choice = choices[Math.floor(Math.random()*choices.length)];
        if(choice == 'D' && this.myDCount > 0){
            this.myDCount--;
            return 'D'
        }
        if(choice == 'W' && this.opDCount == 0){
            return this.randomShoot(this.randomiser);
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
        if(myLastMove == 'W'){
            this.consecutiveWaterBombs++;
        } else {
            this.consecutiveWaterBombs = 0;
        }
        console.log(myLastMove + ' vs ' + lastOpponentMove);
        if(lastOpponentMove == 'D'){
            this.opDCount--;
        }
        if(lastOpponentMove == myLastMove){
            // this.resultRecord.push(0);
            this.consecutiveLoses++;
            return;
        }
        let toWinOp = this.toWin[lastOpponentMove] as Array<String>;
        if(toWinOp.includes(myLastMove)){
            // this.resultRecord.push(1);
            this.consecutiveLoses = 0;
        } else {
            // this.resultRecord.push(-1);
            this.consecutiveLoses++;
        }
    }
}

export = new Bot();
