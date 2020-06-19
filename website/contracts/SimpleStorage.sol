pragma solidity ^0.5.16;

contract SimpleStorage {

    struct Message {
        string word; // 留言
        address from; // 留言者地址
        string timestamp ; // 留言unix时间戳
    }

    string[] private picArr;
    Message[] private wordArr;
    uint giveMoneyPeopleNumber;
    address payable owner;
    
    mapping(address=>uint) giveMoneyTimes;
    uint currentMaxMoney;
    
    // event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor()public{
        giveMoneyPeopleNumber=0;
        owner=msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
      }
    
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
      }
    
    


    function setWord(string memory s, string memory t) public {
        wordArr.push(Message({
            word: s,
            from: msg.sender,
            timestamp: t
        }));
    }

    function getRandomWord(uint random) public view returns (uint, string memory, address, string memory) {
        if(wordArr.length==0){
            return (0, "", msg.sender, "");
        }else{
            Message storage result = wordArr[random];
            return (wordArr.length, result.word, result.from, result.timestamp);
        }
        
    }

    function setPicByHash(string memory s) public {
        picArr.push(s);
    }

    function getRandomPic(uint random) public view returns (uint,string memory) {
        if(picArr.length==0){
            return (0,"");
        }else{
            string memory resultpipic= picArr[random];
            return (picArr.length,resultpipic);
        }
    }
    
    
    function sendMoney()payable public{
        require(msg.value>=0.01 ether);
        if(msg.value>currentMaxMoney){currentMaxMoney=msg.value;}
        giveMoneyTimes[msg.sender]++;
        giveMoneyPeopleNumber++;
    }
    
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
    
    function withdraw() external onlyOwner {
        owner.transfer(address(this).balance);
    }
    
    function getMaxGiveMoneyTimes() view public returns(uint){
        return currentMaxMoney;
    }

}
