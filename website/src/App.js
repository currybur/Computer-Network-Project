import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
// animate
import { StyleSheet, css } from 'aphrodite';
import { spaceInLeft, spaceOutRight } from 'react-magic';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

// animate style
const styles = StyleSheet.create({
    in: {
        animationName: spaceInLeft,
        animationDuration: '2s'
    },
    out: {
        animationName: spaceOutRight,
        animationDuration: '2s'
    }
});

//const contractAddress = "0x2E9b6D3D122aE76963Bce45019b202a0D52F2687" // 合约地址
const contractAddress = "0x387bBde5e122Bb257D2a220d5e658957864a8D53"
var simpleStorageInstance // 合约实例


class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
            word: null,
            from: null,
            timestamp: null,
			random: 0,
			count: 0,
            piccount: 0,
			input: '',
            inputpic: '',
            i: 0,
            web3: null,
            emptyTip: "留言板还是空的呢，快来创建世界第一条留言吧~",
            firstTimeLoad: true,
            loading: false,
            loadingTip: "留言写入区块链可能需要一段时间，稍微耐心等待一下~",
            waitingTip: "留言写入区块链可能需要一段时间，稍微耐心等待一下~",
            successTipPIC: "恭喜你，图片上传成功啦！",
            waitingTipPIC: "图片写入区块链可能需要一段时间，稍微耐心等待一下~",
            successTipMoney: "恭喜你，转账成功啦！",
            waitingTipMoney: "转账写入区块链可能需要一段时间，稍微耐心等待一下~",
            successTip: "恭喜你，留言成功啦！",
            animate: "",
            in: css(styles.in),
            out: css(styles.out),
            pictotalNum: 5,
            imgT: [
            "https://ipfs.io/ipfs/QmZ9DVJS2rre9GwAdejuTUnt4bJGaV6h1b8DyUgim55x3j?filename=%5Cpic%5Cmallard-5303333__340.jpg",
            "https://ipfs.io/ipfs/QmWYonFt4o4dJJiMQn8nxNbT1sv6BV2ZAH4E6BcrgsNvFB?filename=%5Cpic%5Cvw-5294230__340.jpg",
            "https://ipfs.io/ipfs/QmdHHewkUNbrHbPaufwy8RZk91w81gkTQdTL9NLVDwPLwf?filename=%5Cpic%5Cbook-5298846__340.jpg",
            "https://ipfs.io/ipfs/QmRZANYicT5LjSV9R5KtEkkDiTimH758kz3TULDWyrBkbx?filename=%5Cpic%5Clandscape-5255326__340.jpg",
            "http://pic.netbian.com/uploads/allimg/171031/131333-15094268133f11.jpg"]

		}
	}

	componentWillMount() {
		getWeb3
		.then(results => {
			this.setState({
				web3: results.web3
			})
			this.instantiateContract()
		})
		.catch(() => {
			console.log('Error finding web3.')
		})
	}

    // 循环从区块上随机读取留言
	randerWord() {
        const that = this
		setInterval(() => {
			let random_num = Math.random() * (this.state.count? this.state.count: 0)
			this.setState({
				random: parseInt(random_num)
			})
			console.log("setInterval读取", this.state.random)
			simpleStorageInstance.getRandomWord(this.state.random)
			.then(result => {
                console.log("setInterval读取成功", result)
                if(result[1]!==this.setState.word){
                    this.setState({
                        animate: this.state.out
                    })
                    setTimeout(() => {
                        that.setState({
                            count: result[0].c[0],
                            word: result[1],
                            from: result[2],
                            timestamp: result[3],
                            animate: this.state.in
                        })
                    }, 2000)
                }
			})
		}, 10000)
	}

    renderPic() {
        const that = this
        setInterval(() => {
            let random_num = Math.random() * (this.state.piccount? this.state.piccount: 0)
            this.setState({
                random: parseInt(random_num)
            })
            console.log("setInterval读取图片", this.state.random)
            simpleStorageInstance.getRandomPic(this.state.random)
            .then(result => {
                console.log("setInterval读取图片成功", result)
                if(result[1]!==this.setState.pic1){
                        let imgList=this.state.imgT;
                        imgList[this.state.i]=result[1]
                        let nextPic=(this.state.i+1)%this.state.pictotalNum
                        that.setState({
                            piccount: result[0].c[0],
                            imgT: imgList,
                            i: nextPic
                        })
                        
                    
                }
                
            })
        },2500)
    }
    
    

	instantiateContract() {
        const that = this
		const contract = require('truffle-contract')
		const simpleStorage = contract(SimpleStorageContract)
		simpleStorage.setProvider(this.state.web3.currentProvider)

		// Get accounts.
		this.state.web3.eth.getAccounts((error, accounts) => {
			simpleStorage.at(contractAddress).then(instance => {
				simpleStorageInstance = instance
				//console.log("合约实例获取成功")
			})
			.then(result => {
				return simpleStorageInstance.getRandomWord(this.state.random)
			})
			.then(result => {
                //console.log("读取成功", result)
                if(result[1]!==this.setState.word){
                    this.setState({
                        animate: this.state.out
                    })
                    setTimeout(() => {
                        that.setState({
                            count: result[0].c[0],
                            word: result[1],
                            from: result[2],
                            timestamp: result[3],
                            animate: this.state.in,
                            firstTimeLoad: false
                        })
                    }, 2000)
                }else{
                    this.setState({
                        firstTimeLoad: false
                    })
                }
                this.renderPic()
				this.randerWord()
                
			})

		})
	}

  	render() {
		return (
			<div className="container bg" >
                
				<header className="header">区块链之永存 {}</header>
				<main>
					<div className="main-container">
						<div className="showword">
                            <div className={this.state.magic1}>
                                {
                                    (simpleStorageInstance && !this.state.firstTimeLoad)
                                    ? <span className={this.state.animate}>{this.state.word || this.state.emptyTip}</span>
                                    : <img src={require("../public/loading/loading-bubbles.svg")} width="64" height="64" alt=""/>
                                }
                            </div>
                            <p className={this.state.animate}>
                                <span>{this.state.word? "来源："+this.state.from: ""}</span>
                                <span>{this.state.word? "时间："+this.formatTime(this.state.timestamp): ""}</span>
                            </p>
                        </div>
						<div className="showimage">
                            <ul>
                                <li><img src={this.state.imgT[1]}></img></li>
                                <li><img src={this.state.imgT[2]}></img></li>
                                <li><img src={this.state.imgT[3]}></img></li>
                                <li><img src={this.state.imgT[4]}></img></li>
                                <li><img src={this.state.imgT[0]}></img></li>
                                
                            </ul>
                        </div>
                        <div className="setword">
                                <textarea type="text" value={this.state.input} onChange={e => this.inputWord(e)}/>
                                <button onClick={() => this.setWord()}>留言</button>
                                <button onClick={() => this.setPic()}>上传图片</button>
                                <button onClick={() => this.sendMoney()}>赞助</button>

                        </div>
                        <div className="tips">
							<div>
								<p>注意事项：</p>
								<ul>
									<li>请安装 Matemask 扩展程序</li>
									<li>网络切换至 Ropoetn Test Network</li>
                                    <li>写入区块链时间不等(10s~5min)，请耐心等待</li>
                                    <li>留言和图片为随机展示，展示机会平等</li>
								</ul>
							</div>
						</div>
					</div>
				</main>
				<footer>By <a href="https://github.com/david990917" target="_blank">Hanwen~</a></footer>
                <div className={this.state.loading? "loading show": "loading"}>
                    <img src={require("../public/loading/loading-bubbles.svg")} width="128" height="128" alt=""/>
                    <p>Matemask 钱包确认支付后开始写入</p>
                    <p>{this.state.loadingTip}</p>
                </div>
			</div>
		);
	}


	inputWord(e){
		this.setState({
			input: e.target.value
		})
    }
    inputPic(e){
        this.setState({
            inputpic: e.target.value
        })
    }


    // 写入区块链
	setWord(){
        if(!this.state.input) return
        const that = this
        this.setState({
            loading: true
        })
		let timestamp = new Date().getTime()
		simpleStorageInstance.setWord(this.state.input, String(timestamp), {from: this.state.web3.eth.accounts[0]})
		.then(result => {
            this.setState({
                loadingTip: that.state.successTip
            })
            setTimeout(() => {
                that.setState({
                    loading: false,
                    input: '',
                    loadingTip: that.state.waitingTip
                })
            }, 1500)
			
        })
        .catch(e => {
            // 拒绝支付
            this.setState({
                loading: false
            })
        })
	}

    setPic(){
        if(!this.state.input) return
        const that = this
        this.setState({
            loading: true
        })
        // let timestamp = new Date().getTime()
        simpleStorageInstance.setPicByHash(this.state.input, {from: this.state.web3.eth.accounts[0]})
        .then(result => {
            this.setState({
                loadingTip: that.state.successTipPIC
            })
            setTimeout(() => {
                that.setState({
                    loading: false,
                    input: '',
                    loadingTip: that.state.waitingTipPIC
                })
            }, 1500)
            
        })
        .catch(e => {
            // 拒绝支付
            this.setState({
                loading: false
            })
        })
    }

    sendMoney(){
        if(!this.state.input) return
        const that = this
        this.setState({
            loading: true
        })
        // let timestamp = new Date().getTime()
        simpleStorageInstance.sendMoney({from: this.state.web3.eth.accounts[0],value: parseInt(this.state.input)})
        .then(result => {
            this.setState({
                loadingTip: that.state.successTip
            })
            setTimeout(() => {
                that.setState({
                    loading: false,
                    input: '',
                    loadingTip: that.state.waitingTip
                })
            }, 1500)
            
        })
        .catch(e => {
            // 拒绝支付
            this.setState({
                loading: false
            })
        })
    }


    // 时间戳转义
    formatTime(timestamp) {
        let date = new Date(Number(timestamp))
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        let fDate = [year, month, day, ].map(this.formatNumber)
        return fDate[0] + '年' + fDate[1] + '月' + fDate[2] + '日' + ' ' + [hour, minute, second].map(this.formatNumber).join(':') 
    }
    /** 小于10的数字前面加0 */
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
}

export default App
