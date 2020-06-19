pragma solidity ^0.5.0;

contract wuziqi{
    uint steps;
    uint public turn;
    uint lineNum=19;
    bool public correctOperation=true;
    bool public endGame=false;
    uint public winner=0;
    
    uint[][] public coord;
    uint[] tmp;
    //constructor(uint _lineNum,uint distance) public{
    constructor() public{    
        steps=0;
        turn=1;
        for(uint j=0;j<lineNum;j++){
            tmp.push(0);
        }
        for(uint i=0;i<lineNum;i++){
            coord.push(tmp);
        }
    }
    
    function clear()public{
        for(uint i=0;i<lineNum;i++){
            coord[i]=tmp;
        }
        turn=1;
        steps=0;
        endGame=false;
    }
    function addChess(uint _x,uint _y,uint _go)public{
       coord[_x][_y]=_go;
    }
    
    function check(uint _x,uint _y,uint _go)public view returns(bool){
        uint i=0;uint j=0;
        //横向
        for(i=1;i<5;i++){if(coord[_x+i][_y]!=_go){break;}}
        for(j=1;j<5;j++){if(_x<j || coord[_x-j][_y]!=_go){break;}}
        if(i+j>5){return true;}
        //纵向
        for(i=1;i<5;i++){if(coord[_x][_y+i]!=_go){break;}}
        for(j=1;j<5;j++){if(_y<j || coord[_x][_y-j]!=_go){break;}}
        if(i+j>5){return true;}
        
        for(i=1;i<5;i++){if(coord[_x+i][_y+i]!=_go){break;}}
        for(j=1;j<5;j++){if(_y<j ||_x<j|| coord[_x-j][_y-j]!=_go){break;}}
        if(i+j>5){return true;}
    
        for(i=1;i<5;i++){if(_x<i||coord[_x-i][_y+i]!=_go){break;}}
        for(j=1;j<5;j++){if(_y<j || coord[_x+j][_y-j]!=_go){break;}}
        if(i+j>5){return true;}
        
        //others
        return false;
    }
    
    function noChess(uint _x,uint _y)public view returns(bool){
        return coord[_x][_y]==0;
    }

    
    

    function play_go(uint x,uint y)public {
        if(noChess(x,y)){
            addChess(x,y,turn);
            endGame=check(x,y,turn);
            if(endGame){winner=turn;correctOperation=true;return;}
            if(turn==1){turn=2;}
            else{turn=1;}
            steps++;
            correctOperation=true;
        }
        else{
            correctOperation=false;
        }
    }
    
    function getCorrectOperation() public view returns(bool){
        return correctOperation;
    } 
    
    function getendGame() public view returns(bool){
        return endGame;
    }
    
    function getWinner()public view returns(uint){
        return winner;
    }
    
    function getSteps()public view returns(uint){
        return steps;
    }
}