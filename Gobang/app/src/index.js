import Web3 from "web3";
import wuziqiArtifact from "../../build/contracts/wuziqi.json";
const App = {
    web3: null,
    account: null,
    meta: null,
    endGame: false,
    play_go_success: true,
    winPlayer: 0,
    steps: 0,
    start: async function() {
        const {
            web3
        } = this;
        try {
            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = wuziqiArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(wuziqiArtifact.abi, deployedNetwork.address, );
            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },
    check: async function(x, y, color) {
        const {
            check
        } = this.meta.methods;
        return await check(x, y, color).call();
    },
    winner: async function() {
        const {
            getWinner
        } = this.meta.methods;
        const winPlayer = await getWinner().call({
            from: this.account
        });
    },
    clear: async function() {
        const {
            clear
        } = this.meta.methods;
        await clear().send({
            from: this.account,
            gas: 999999
        });
        console.log("clear");
    },
    play_go: async function(x, y) {
        const {
            play_go
        } = this.meta.methods;
        await play_go(x, y).send({
            from: this.account,
            gas: 1999999
        });
        setTimeout(function() {
            App.correctOperation();
            App.endGameFunction();
            App.winner();
            App.getSteps();
            // console.log("steps0",App.steps);
        }, 1000)
        // console.log("steps1",this.steps);
    },
    endGameFunction: async function() {
        const {
            getendGame
        } = this.meta.methods;
        this.endGame = await getendGame().call({
            from: this.account,
            gas: 999999
        });
    },
    correctOperation: async function() {
        const {
            getCorrectOperation
        } = this.meta.methods;
        this.play_go_success = await getCorrectOperation().call({
            from: this.account,
            gas: 999999
        });
    },
    winner: async function() {
        const {
            getWinner
        } = this.meta.methods;
        this.winPlayer = await getWinner().call({
            from: this.account,
            gas: 999999
        });
    },
    getSteps: async function() {
        const {
            getSteps
        } = this.meta.methods;
        this.steps = await getSteps().call({
            from: this.account,
            gas: 999999
        });
    }
};
window.App = App;
window.addEventListener("load", function() {
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    } else {
        console.log("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live", );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"), );
    }
    App.start();
});