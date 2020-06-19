pragma solidity ^0.5.16;

contract AeroplaneChess{
    struct Player{
        string color;
        string state;
    }
    
    uint public currentUser=2;
    uint public userListLength=4;
    string[4] colorList=["red","blue","yellow","green"];
    uint public diceNum=0;
   
    Player[4] public player_list;
   
    constructor()public{
        for(uint _i=0; _i<4; _i++){
        player_list[_i].color=colorList[_i];
        }
    }
   
    function _setStateForUser(uint _color_id,string memory _state)public{
        player_list[_color_id].state=_state;
    }
    
    function findFirstUser() public returns(uint){
        for(uint _i=0; _i<userListLength; _i++){
            if(keccak256(bytes(player_list[_i].state)) == keccak256(bytes("normal"))){
                currentUser=_i;
            }
        }
    }
    
    function setDiceNum(uint _diceNum)public{
        diceNum=_diceNum;
    }
   
}